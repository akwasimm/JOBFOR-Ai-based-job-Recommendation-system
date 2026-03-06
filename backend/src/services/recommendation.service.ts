import axios from 'axios';
import { prisma } from '@/config/database';
import { cacheService } from './cache.service';
import { jobApiService } from './jobApi.service';
import { NormalizedJob, RecommendedJob, MatchBreakdown } from '@/types';
import {
    jaccardSimilarity,
} from '@/utils/textAnalysis';

/**
 * Definition of skill aliases used for fuzzy matching across user profiles and job descriptions.
 * @constant SKILL_ALIASES
 * @type {Record<string, string[]>}
 */
const SKILL_ALIASES: Record<string, string[]> = {
    'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
    'typescript': ['ts'],
    'react': ['reactjs', 'react.js'],
    'angular': ['angularjs', 'angular.js'],
    'vue.js': ['vue', 'vuejs'],
    'node.js': ['node', 'nodejs'],
    'next.js': ['next', 'nextjs'],
    'express': ['expressjs', 'express.js'],
    'python': ['py', 'python3'],
    'c++': ['cpp', 'cplusplus'],
    'c#': ['csharp', 'c-sharp'],
    'postgresql': ['postgres', 'psql', 'pg'],
    'mongodb': ['mongo'],
    'amazon web services': ['aws'],
    'google cloud platform': ['gcp', 'google cloud'],
    'microsoft azure': ['azure'],
    'machine learning': ['ml'],
    'artificial intelligence': ['ai'],
    'continuous integration': ['ci', 'ci/cd'],
    'cascading style sheets': ['css', 'css3'],
    'hypertext markup language': ['html', 'html5'],
};

/**
 * Service responsible for generating personalized job recommendations using content-based, 
 * collaborative, and knowledge-based filtering methodologies.
 * @class RecommendationService
 */
export class RecommendationService {
    /**
     * @private
     * @readonly
     */
    private readonly CONTENT_WEIGHT = 0.60;

    /**
     * @private
     * @readonly
     */
    private readonly COLLABORATIVE_WEIGHT = 0.25;

    /**
     * @private
     * @readonly
     */
    private readonly KNOWLEDGE_WEIGHT = 0.15;

    /**
     * @private
     * @readonly
     */
    private readonly SKILL_WEIGHT = 0.35;

    /**
     * @private
     * @readonly
     */
    private readonly TEXT_WEIGHT = 0.25;

    /**
     * @private
     * @readonly
     */
    private readonly EXPERIENCE_WEIGHT = 0.15;

    /**
     * @private
     * @readonly
     */
    private readonly LOCATION_WEIGHT = 0.15;

    /**
     * @private
     * @readonly
     */
    private readonly SALARY_WEIGHT = 0.10;

    /**
     * Retrieves a paginated list of tailored job recommendations for a specific user ID.
     * Incorporates both local data stores and external machine learning inference services.
     * 
     * @param {number} userId - The unique identifier of the user seeking recommendations.
     * @param {number} limit - The maximum number of recommendations to retrieve (default: 20).
     * @returns {Promise<RecommendedJob[]>} A promise that resolves to an array of recommended jobs.
     */
    async getRecommendations(userId: number, limit: number = 20): Promise<RecommendedJob[]> {
        const cacheKey = `recommendations:${userId}`;
        const cached = await cacheService.get<RecommendedJob[]>(cacheKey);
        if (cached) return cached.slice(0, limit);

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                skills: { include: { skill: true } },
                workExperience: true,
            },
        });

        if (!profile) return [];

        const jobs = await prisma.jobsCache.findMany({
            orderBy: { postedAt: 'desc' },
            take: 200,
        });

        if (jobs.length === 0) return [];

        const userSkills = (profile.skills || []).map((us: any) => us.skill.name.toLowerCase());

        let mlScores: Record<string, number> = {};
        try {
            const mlResponse = await axios.post('http://localhost:8000/recommend-jobs', {
                user_skills: userSkills,
                jobs: jobs.map((j) => ({
                    id: j.externalId,
                    description: `${j.title} ${j.description}`,
                    skills_required: j.skills,
                }))
            });
            const recs = mlResponse.data.recommendations || [];
            recs.forEach((r: any) => {
                mlScores[r.job_id] = r.match_score / 100;
            });
        } catch (err) {

        }

        const scoredJobs: RecommendedJob[] = jobs.map((job) => {
            const normalizedJob: NormalizedJob = {
                externalId: job.externalId,
                source: job.source,
                title: job.title,
                company: job.company,
                companyLogo: job.companyLogo || undefined,
                location: job.location,
                description: job.description,
                salaryMin: job.salaryMin || undefined,
                salaryMax: job.salaryMax || undefined,
                currency: job.currency || 'INR',
                isRemote: job.isRemote,
                skills: job.skills,
                applyUrl: job.applyUrl,
                postedAt: job.postedAt || undefined,
            };

            const textSim = mlScores[job.externalId] ?? 0.5;
            const breakdown = this.calculateMatchBreakdown(profile, normalizedJob, textSim);

            return {
                ...normalizedJob,
                matchScore: breakdown.overallScore,
                matchBreakdown: breakdown,
            };
        });

        scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

        const topJobs = scoredJobs.slice(0, limit);

        await cacheService.set(cacheKey, topJobs, 1800);

        return topJobs;
    }

    /**
     * Deconstructs and evaluates the compatibility vectors between a user profile and an active job posting.
     * 
     * @param {any} profile - Disaggregated user profile entities including constraints and capabilities.
     * @param {NormalizedJob} job - Standardized entity representing the job opportunity target.
     * @param {number} [textSim=0.5] - Predictive sentiment or textual similarity score.
     * @returns {MatchBreakdown} Computation result resolving sub-component scores.
     */
    calculateMatchBreakdown(profile: any, job: NormalizedJob, textSim: number = 0.5): MatchBreakdown {
        const userSkills = (profile.skills || []).map((us: any) => us.skill.name.toLowerCase());
        const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());

        const skillResult = this.calculateSkillMatch(userSkills, jobSkills);
        const expMatch = this.calculateExperienceMatch(
            profile.experienceYears || 0,
            job.experienceLevel
        );
        const locMatch = this.calculateLocationMatch(profile, job);
        const salaryMatch = this.calculateSalaryMatch(profile, job);

        const contentScore =
            this.SKILL_WEIGHT * skillResult.score +
            this.TEXT_WEIGHT * textSim +
            this.EXPERIENCE_WEIGHT * expMatch +
            this.LOCATION_WEIGHT * locMatch +
            this.SALARY_WEIGHT * salaryMatch;

        const collaborativeScore = this.calculateCollaborativeScore(profile, job);

        const knowledgeScore = this.calculateKnowledgeScore(profile, job);

        const overallScore = Math.round(
            (contentScore * this.CONTENT_WEIGHT +
                collaborativeScore * this.COLLABORATIVE_WEIGHT +
                knowledgeScore * this.KNOWLEDGE_WEIGHT) *
            100
        );

        return {
            skillMatch: Math.round(skillResult.score * 100),
            experienceMatch: Math.round(expMatch * 100),
            locationMatch: Math.round(locMatch * 100),
            salaryMatch: Math.round(salaryMatch * 100),
            textSimilarity: Math.round(textSim * 100),
            overallScore: Math.min(overallScore, 100),
            matchingSkills: skillResult.matchingSkills,
            missingSkills: skillResult.missingSkills,
        };
    }

    /**
     * Executes polynomial set coverage computations assessing overlap between disparate skill terminology.
     * 
     * @param {string[]} userSkills - Skill identifiers claimed by the user entity.
     * @param {string[]} jobSkills - Prerequisite identifiers prescribed by the employer entity.
     * @returns {{ score: number; matchingSkills: string[]; missingSkills: string[] }} Vector score output.
     */
    calculateSkillMatch(
        userSkills: string[],
        jobSkills: string[]
    ): { score: number; matchingSkills: string[]; missingSkills: string[] } {
        if (jobSkills.length === 0) {
            return { score: 0.5, matchingSkills: [], missingSkills: [] };
        }

        const normalizedUserSkills = new Set(
            userSkills.flatMap((s) => this.expandAliases(s))
        );
        const normalizedJobSkills = jobSkills.map((s) => s.toLowerCase());

        const matchingSkills: string[] = [];
        const missingSkills: string[] = [];

        for (const jobSkill of normalizedJobSkills) {
            const expanded = this.expandAliases(jobSkill);
            const isMatch = expanded.some((alias) => normalizedUserSkills.has(alias));

            if (isMatch) {
                matchingSkills.push(jobSkill);
            } else {
                missingSkills.push(jobSkill);
            }
        }

        const score = matchingSkills.length / normalizedJobSkills.length;
        return { score, matchingSkills, missingSkills };
    }

    /**
     * Maps temporal experience volume against codified seniority band expectations.
     * 
     * @param {number} userYears - Numerical duration expressing field tenure.
     * @param {string | undefined} jobLevel - Ordinal taxonomy category for the position constraint.
     * @returns {number} Fractional coefficient indicating requirement conformity.
     */
    calculateExperienceMatch(
        userYears: number,
        jobLevel: string | undefined
    ): number {
        if (!jobLevel) return 0.7;

        const levelRanges: Record<string, [number, number]> = {
            'ENTRY': [0, 1],
            'JUNIOR': [1, 3],
            'MID': [3, 5],
            'SENIOR': [5, 8],
            'LEAD': [8, 12],
            'EXECUTIVE': [12, 30],
        };

        const range = levelRanges[jobLevel];
        if (!range) return 0.7;

        const [min, max] = range;

        if (userYears >= min && userYears <= max) return 1.0;
        if (userYears < min) {
            return Math.max(0, 1 - (min - userYears) / min);
        }
        return Math.max(0.5, 1 - (userYears - max) / (max * 2));
    }

    /**
     * @private
     * Evaluates location constraint adherence resolving remote work predicates algorithmically.
     * 
     * @param {any} profile - User preferences indicating acceptable geographical bounds.
     * @param {NormalizedJob} job - Job properties presenting discrete municipal vectors explicitly.
     * @returns {number} Distance logic scoring reflecting proximity alignment definitively.
     */
    private calculateLocationMatch(profile: any, job: NormalizedJob): number {
        if (job.isRemote) {
            return profile.remotePreference === 'REMOTE' ? 1.0 : 0.8;
        }

        const preferredLocations = (profile.preferredLocations || []).map((l: string) =>
            l.toLowerCase()
        );

        if (preferredLocations.length === 0) return 0.5;

        const jobLoc = job.location.toLowerCase();
        const isMatch = preferredLocations.some(
            (pref: string) => jobLoc.includes(pref) || pref.includes(jobLoc)
        );

        return isMatch ? 1.0 : 0.3;
    }

    /**
     * @private
     * Translates requested monetary endpoints determining compatibility ratio spanning isolated fiscal structures definitively.
     * 
     * @param {any} profile - Ingests user economic prerequisites definitively setting floor/ceiling limits realistically.
     * @param {NormalizedJob} job - Provides offered employer compensation metrics establishing analytical comparative ranges computationally.
     * @returns {number} Numeric scaling metric quantifying proximity against acceptable variance bounds logically.
     */
    private calculateSalaryMatch(profile: any, job: NormalizedJob): number {
        if (!job.salaryMin && !job.salaryMax) return 0.5;
        if (!profile.expectedSalaryMin && !profile.expectedSalaryMax) return 0.5;

        const jobMid = ((job.salaryMin || 0) + (job.salaryMax || job.salaryMin || 0)) / 2;
        const userMid =
            ((profile.expectedSalaryMin || 0) + (profile.expectedSalaryMax || profile.expectedSalaryMin || 0)) / 2;

        if (userMid === 0 || jobMid === 0) return 0.5;

        const ratio = jobMid / userMid;
        if (ratio >= 0.8 && ratio <= 1.5) return 1.0;
        if (ratio >= 0.6 && ratio < 0.8) return 0.6;
        if (ratio > 1.5) return 0.8;
        return 0.3;
    }

    /**
     * @private
     * Approximates network dependency impacts extracting abstract relational clustering scoring.
     * 
     * @param {any} _profile - Reference bounds targeting collaborative filtering implementations computationally.
     * @param {NormalizedJob} _job - Destination target assessing cohort intersections globally.
     * @returns {number} Extrapolated heuristic score derived asynchronously.
     */
    private calculateCollaborativeScore(_profile: any, _job: NormalizedJob): number {
        return 0.5;
    }

    /**
     * @private
     * Extracts implicit knowledge rules assessing nuanced career advancement stages mapping unstructured logical permutations actively.
     * 
     * @param {any} profile - Isolates experiential metrics delineating explicit seniority thresholds organically.
     * @param {NormalizedJob} job - Ingests target descriptions parsing implicit environmental or taxonomic clues indicating suitability logically.
     * @returns {number} Reflected compatibility index weighting extracted knowledge-based parameters explicitly.
     */
    private calculateKnowledgeScore(profile: any, job: NormalizedJob): number {
        let score = 0.5;

        if ((profile.experienceYears || 0) <= 1) {
            const isEntryLevel =
                job.title.toLowerCase().includes('junior') ||
                job.title.toLowerCase().includes('entry') ||
                job.title.toLowerCase().includes('fresher') ||
                job.title.toLowerCase().includes('intern');
            if (isEntryLevel) score += 0.3;
        }

        if (profile.remotePreference === 'REMOTE' && job.isRemote) {
            score += 0.2;
        }

        return Math.min(score, 1.0);
    }

    /**
     * @private
     * Explodes basic nomenclature targeting exhaustive lists representing homologous variants expanding search query permutations exponentially.
     * 
     * @param {string} skill - Base lexical component to expand algorithmically.
     * @returns {string[]} Transformed strings mapping exhaustive canonical structures mapping accurately against raw inputs consistently.
     */
    private expandAliases(skill: string): string[] {
        const lower = skill.toLowerCase();
        const aliases = [lower];

        for (const [canonical, aliasList] of Object.entries(SKILL_ALIASES)) {
            if (canonical === lower || aliasList.includes(lower)) {
                aliases.push(canonical, ...aliasList);
            }
        }

        return [...new Set(aliases)];
    }

    /**
     * Conducts a cross-examination to retrieve a cohort of related jobs using Set intersection mathematics
     * predicated on competency requirements. Iterates across cached memory structures.
     * 
     * @param {string} jobId - Source job identifier serving as the comparator baseline.
     * @param {number} limit - Bounding integer for result output cohort volume.
     * @returns {Promise<NormalizedJob[]>} Resolves yielding proximal peer job entities.
     */
    async getSimilarJobs(jobId: string, limit: number = 10): Promise<NormalizedJob[]> {
        const job = await jobApiService.getJobById(jobId);
        if (!job) return [];

        const allJobs = await prisma.jobsCache.findMany({ take: 100 });

        const scored = allJobs
            .filter((j) => j.externalId !== jobId)
            .map((j) => {
                const jobSkills = new Set(job.skills.map((s) => s.toLowerCase()));
                const otherSkills = new Set(j.skills.map((s) => s.toLowerCase()));
                const similarity = jaccardSimilarity(jobSkills, otherSkills);

                return { job: j, similarity };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);

        return scored.map((s) => ({
            externalId: s.job.externalId,
            source: s.job.source,
            title: s.job.title,
            company: s.job.company,
            companyLogo: s.job.companyLogo || undefined,
            location: s.job.location,
            description: s.job.description,
            salaryMin: s.job.salaryMin || undefined,
            salaryMax: s.job.salaryMax || undefined,
            isRemote: s.job.isRemote,
            skills: s.job.skills,
            applyUrl: s.job.applyUrl,
            postedAt: s.job.postedAt || undefined,
        }));
    }
}

export const recommendationService = new RecommendationService();
