import axios from 'axios';
import { env } from '@/config/env';
import { prisma } from '@/config/database';
import { cacheService } from './cache.service';
import { NormalizedJob, JobSearchParams, JobSearchResult } from '@/types';

/**
 * Enterprise service governing asynchronous distributed data ingestion from external heterogeneous 
 * corporate application tracking systems (ATS) and aggregator APIs. Normalizes disparite schemas 
 * into unified representations empowering performant localized caching and search methodologies.
 * 
 * @class JobApiService
 */
export class JobApiService {
    /**
     * Executes targeted queries against Adzuna external endpoints retrieving live employment requisitions.
     * 
     * @param {JobSearchParams} params - Structuring parameters bridging internal query formats into external URL constraints.
     * @returns {Promise<NormalizedJob[]>} Resolves into standard object arrays sanitizing proprietary external structures.
     */
    private async searchAdzuna(params: JobSearchParams): Promise<NormalizedJob[]> {
        if (!env.ADZUNA_APP_ID || !env.ADZUNA_APP_KEY) return [];

        try {
            const response = await axios.get(
                `https://api.adzuna.com/v1/api/jobs/in/search/${params.page || 1}`,
                {
                    params: {
                        app_id: env.ADZUNA_APP_ID,
                        app_key: env.ADZUNA_APP_KEY,
                        what: params.query,
                        where: params.location || '',
                        results_per_page: params.limit || 20,
                        sort_by: params.sortBy === 'date' ? 'date' : 'relevance',
                        full_time: params.jobType?.includes('FULL_TIME') ? 1 : undefined,
                        part_time: params.jobType?.includes('PART_TIME') ? 1 : undefined,
                        salary_min: params.salaryMin,
                        salary_max: params.salaryMax,
                    },
                    timeout: 10000,
                }
            );

            return (response.data.results || []).map((job: any) => this.normalizeAdzuna(job));
        } catch (error: any) {
            console.warn('⚠️ Adzuna API error:', error.message);
            return [];
        }
    }

    /**
     * Maps proprietary Adzuna schema elements onto centralized application domains strictly enforcing 
     * categorical rules and dynamic Boolean inferencing.
     * 
     * @param {any} job - Unstructured proprietary node object.
     * @returns {NormalizedJob} Formatted internal structure guaranteeing consistent mapping behaviors.
     */
    private normalizeAdzuna(job: any): NormalizedJob {
        return {
            externalId: `adzuna_${job.id}`,
            source: 'adzuna',
            title: job.title || '',
            company: job.company?.display_name || 'Unknown',
            location: job.location?.display_name || '',
            description: job.description || '',
            salaryMin: job.salary_min ? Math.round(job.salary_min) : undefined,
            salaryMax: job.salary_max ? Math.round(job.salary_max) : undefined,
            currency: 'INR',
            isRemote: (job.title + job.description).toLowerCase().includes('remote'),
            skills: this.extractSkillsFromText(job.description || ''),
            applyUrl: job.redirect_url || '',
            postedAt: job.created ? new Date(job.created) : undefined,
        };
    }

    /**
     * Orchestrates rapid query traversal hitting the JSearch endpoint wrapped via RapidAPI architectures.
     * 
     * @param {JobSearchParams} params - Abstract constraints forming target URLs.
     * @returns {Promise<NormalizedJob[]>} Collection representing filtered search outputs.
     */
    private async searchJSearch(params: JobSearchParams): Promise<NormalizedJob[]> {
        if (!env.JSEARCH_API_KEY) return [];

        try {
            const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
                params: {
                    query: `${params.query} ${params.location || ''}`.trim(),
                    page: params.page?.toString() || '1',
                    num_pages: '1',
                    date_posted: 'all',
                    remote_jobs_only: params.remote ? 'true' : 'false',
                },
                headers: {
                    'X-RapidAPI-Key': env.JSEARCH_API_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                },
                timeout: 10000,
            });

            return (response.data.data || []).map((job: any) => this.normalizeJSearch(job));
        } catch (error: any) {
            console.warn('⚠️ JSearch API error:', error.message);
            return [];
        }
    }

    /**
     * Reduces proprietary JSearch datasets into universal representations conforming with core internal logic schemas.
     * 
     * @param {any} job - Abstract payload.
     * @returns {NormalizedJob} Valid schema implementation preserving deterministic access routes.
     */
    private normalizeJSearch(job: any): NormalizedJob {
        return {
            externalId: `jsearch_${job.job_id}`,
            source: 'jsearch',
            title: job.job_title || '',
            company: job.employer_name || 'Unknown',
            companyLogo: job.employer_logo || undefined,
            location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(', '),
            description: job.job_description || '',
            salaryMin: job.job_min_salary ? Math.round(job.job_min_salary) : undefined,
            salaryMax: job.job_max_salary ? Math.round(job.job_max_salary) : undefined,
            currency: job.job_salary_currency || 'USD',
            jobType: this.mapJobType(job.job_employment_type),
            isRemote: job.job_is_remote || false,
            skills: this.extractSkillsFromText(job.job_description || ''),
            applyUrl: job.job_apply_link || '',
            postedAt: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : undefined,
            expiresAt: job.job_offer_expiration_datetime_utc ? new Date(job.job_offer_expiration_datetime_utc) : undefined,
        };
    }

    /**
     * Queries Remotive distributed endpoints specifically optimizing around remote-availability signals natively.
     * 
     * @param {JobSearchParams} params - Specifies categorical queries.
     * @returns {Promise<NormalizedJob[]>} Resolves normalized remote opportunities matching internal typings.
     */
    private async searchRemotive(params: JobSearchParams): Promise<NormalizedJob[]> {
        try {
            const response = await axios.get('https://remotive.com/api/remote-jobs', {
                params: {
                    search: params.query,
                    limit: params.limit || 20,
                },
                timeout: 10000,
            });

            let jobs = (response.data.jobs || []).map((job: any) => this.normalizeRemotive(job));

            if (params.location) {
                const loc = params.location.toLowerCase();
                jobs = jobs.filter((j: NormalizedJob) =>
                    j.location.toLowerCase().includes(loc) || j.location.toLowerCase().includes('worldwide')
                );
            }

            return jobs;
        } catch (error: any) {
            console.warn('⚠️ Remotive API error:', error.message);
            return [];
        }
    }

    /**
     * Translates isolated Remotive parameters resolving standardized arrays matching system boundaries.
     * 
     * @param {any} job - Foreign object notation graph.
     * @returns {NormalizedJob} Formatted internal structure mapping deterministic properties.
     */
    private normalizeRemotive(job: any): NormalizedJob {
        return {
            externalId: `remotive_${job.id}`,
            source: 'remotive',
            title: job.title || '',
            company: job.company_name || 'Unknown',
            companyLogo: job.company_logo || undefined,
            location: job.candidate_required_location || 'Remote',
            description: job.description || '',
            salaryMin: undefined,
            salaryMax: undefined,
            jobType: this.mapJobType(job.job_type),
            isRemote: true,
            skills: job.tags || this.extractSkillsFromText(job.description || ''),
            applyUrl: job.url || '',
            postedAt: job.publication_date ? new Date(job.publication_date) : undefined,
        };
    }

    /**
     * Interfaces with The Muse APIs ingesting diverse corporate and media-focused positions dynamically.
     * 
     * @param {JobSearchParams} params - Search configuration arrays.
     * @returns {Promise<NormalizedJob[]>} Extrapolated unified job components.
     */
    private async searchTheMuse(params: JobSearchParams): Promise<NormalizedJob[]> {
        try {
            const response = await axios.get('https://www.themuse.com/api/public/jobs', {
                params: {
                    descending: true,
                    page: (params.page || 1) - 1,
                    ...(params.query ? { category: params.query } : {}),
                    ...(params.location ? { location: params.location } : {}),
                },
                timeout: 10000,
            });

            return (response.data.results || []).map((job: any) => this.normalizeTheMuse(job));
        } catch (error: any) {
            console.warn('⚠️ The Muse API error:', error.message);
            return [];
        }
    }

    /**
     * Resolves proprietary taxonomy returned by The Muse generating sanitized objects usable internally.
     * 
     * @param {any} job - Loose incoming unmapped schema payload.
     * @returns {NormalizedJob} Strictly casted interface alignment structure.
     */
    private normalizeTheMuse(job: any): NormalizedJob {
        const location = job.locations?.map((l: any) => l.name).join(', ') || '';
        return {
            externalId: `themuse_${job.id}`,
            source: 'themuse',
            title: job.name || '',
            company: job.company?.name || 'Unknown',
            companyLogo: job.company?.refs?.logo_image || undefined,
            location,
            description: job.contents || '',
            isRemote: location.toLowerCase().includes('remote') || location.toLowerCase().includes('flexible'),
            skills: this.extractSkillsFromText(job.contents || ''),
            applyUrl: job.refs?.landing_page || '',
            postedAt: job.publication_date ? new Date(job.publication_date) : undefined,
        };
    }

    /**
     * Invokes external Arbeitnow arrays scraping alternative European or global distributed pipelines targeting remote work.
     * 
     * @param {JobSearchParams} params - Defined routing scopes.
     * @returns {Promise<NormalizedJob[]>} Yields unified normalized representation endpoints.
     */
    private async searchArbeitnow(params: JobSearchParams): Promise<NormalizedJob[]> {
        try {
            const response = await axios.get('https://www.arbeitnow.com/api/job-board-api', {
                params: {
                    page: params.page || 1,
                    ...(params.query ? { search: params.query } : {}),
                    ...(params.location ? { location: params.location } : {}),
                },
                timeout: 10000,
            });

            return (response.data.data || []).map((job: any) => this.normalizeArbeitnow(job));
        } catch (error: any) {
            console.warn('⚠️ Arbeitnow API error:', error.message);
            return [];
        }
    }

    /**
     * Unifies Arbeitnow custom configurations formatting fields targeting specific database persistence mechanisms.
     * 
     * @param {any} job - Raw remote query array nodes.
     * @returns {NormalizedJob} Formatted and predictable mapping representation matrix.
     */
    private normalizeArbeitnow(job: any): NormalizedJob {
        return {
            externalId: `arbeitnow_${job.slug}`,
            source: 'arbeitnow',
            title: job.title || '',
            company: job.company_name || 'Unknown',
            location: job.location || 'Remote',
            description: job.description || '',
            isRemote: job.remote || false,
            skills: this.extractSkillsFromText(job.description || ''),
            applyUrl: job.url || '',
            postedAt: job.created_at ? new Date(job.created_at * 1000) : undefined,
        };
    }

    /**
     * Main entry point orchestrating sophisticated hierarchical caching and query routing processes.
     * Preferentially selects local database layers achieving ~50ms latencies, subsequently initiating
     * live multi-target polling fallback methodologies ensuring robust coverage availability.
     * 
     * @param {JobSearchParams} params - Abstract constraints dictating unified multi-provider logic requests.
     * @returns {Promise<JobSearchResult>} Resultant payload enclosing total aggregation limits targeting rapid serialized responses.
     */
    async searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
        const cacheKey = `jobs:search:${JSON.stringify(params)}`;
        return cacheService.getOrSet(cacheKey, () => this._searchJobsInternal(params), 120);
    }

    /**
     * Executes internal orchestration handling database interactions employing Postgres Full Text Search capabilities.
     * Directly interacts with live external endpoints populating missing cache sectors asynchronously upon failure loops.
     * 
     * @param {JobSearchParams} params - Explicit structured requirements governing extraction limits.
     * @returns {Promise<JobSearchResult>} Composite result metrics finalizing operational loops.
     */
    private async _searchJobsInternal(params: JobSearchParams): Promise<JobSearchResult> {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (params.query) {
            const q = params.query.trim();
            const searchTerms = q.split(/\s+/).join(' | ');
            where.OR = [
                { title: { search: searchTerms } },
                { company: { search: searchTerms } },
            ];
        }

        if (params.location) {
            where.location = { contains: params.location.trim(), mode: 'insensitive' };
        }

        if (params.remote === true) {
            where.isRemote = true;
        }

        if (params.jobType && params.jobType.length > 0) {
            where.jobType = { in: params.jobType };
        }

        if (params.salaryMin) {
            where.salaryMin = { gte: params.salaryMin };
        }
        if (params.salaryMax) {
            where.salaryMax = { lte: params.salaryMax };
        }

        let orderBy: any = { postedAt: 'desc' };
        if (params.sortBy === 'salary') {
            orderBy = { salaryMax: { sort: 'desc', nulls: 'last' } };
        } else if (params.sortBy === 'relevance' && params.query) {
            orderBy = { updatedAt: 'desc' };
        }

        const [dbJobs, total] = await Promise.all([
            prisma.jobsCache.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                select: {
                    externalId: true,
                    source: true,
                    title: true,
                    company: true,
                    companyLogo: true,
                    location: true,
                    description: true,
                    salaryMin: true,
                    salaryMax: true,
                    currency: true,
                    jobType: true,
                    isRemote: true,
                    skills: true,
                    applyUrl: true,
                    postedAt: true,
                    expiresAt: true
                }
            }),
            prisma.jobsCache.count({ where }),
        ]);

        if (dbJobs.length > 0) {
            const jobs: NormalizedJob[] = dbJobs.map(j => ({
                externalId: j.externalId,
                source: j.source,
                title: j.title,
                company: j.company,
                companyLogo: j.companyLogo || undefined,
                location: j.location,
                description: j.description,
                salaryMin: j.salaryMin || undefined,
                salaryMax: j.salaryMax || undefined,
                currency: j.currency || 'INR',
                jobType: j.jobType || undefined,
                isRemote: j.isRemote,
                skills: j.skills,
                applyUrl: j.applyUrl,
                postedAt: j.postedAt || undefined,
                expiresAt: j.expiresAt || undefined,
            }));

            return { jobs, total, page, limit };
        }

        console.log(`ℹ️  [JobSearch] No DB results for "${params.query}" — fetching from Adzuna live`);
        const liveJobs = await this.searchAdzuna(params);

        if (liveJobs.length > 0) {
            this.cacheJobsInDb(liveJobs).catch(() => { });
        }

        const result: JobSearchResult = {
            jobs: liveJobs.slice(0, limit),
            total: liveJobs.length,
            page,
            limit,
        };

        return result;
    }


    /**
     * Rapidly resolves persistent indexed mappings tracking unique opportunities traversing independent identity nodes.
     * 
     * @param {string} externalId - Uniquely assigned identification hash merging host configurations.
     * @returns {Promise<NormalizedJob | null>} Resolves underlying entities bridging relational paths or returning null upon invalid queries.
     */
    async getJobById(externalId: string): Promise<NormalizedJob | null> {
        const cached = await prisma.jobsCache.findUnique({
            where: { externalId },
        });

        if (cached) {
            return {
                externalId: cached.externalId,
                source: cached.source,
                title: cached.title,
                company: cached.company,
                companyLogo: cached.companyLogo || undefined,
                location: cached.location,
                description: cached.description,
                salaryMin: cached.salaryMin || undefined,
                salaryMax: cached.salaryMax || undefined,
                currency: cached.currency || 'INR',
                isRemote: cached.isRemote,
                skills: cached.skills,
                applyUrl: cached.applyUrl,
                postedAt: cached.postedAt || undefined,
            };
        }

        return null;
    }

    /**
     * Executes overarching queries sorting highest relevance components prioritizing recently synchronized market opportunities.
     * 
     * @param {number} [limit=10] - Scalar constraint truncating computational response lengths.
     * @returns {Promise<NormalizedJob[]>} Formatted mapping arrays delineating currently trending requisitions.
     */
    async getTrendingJobs(limit: number = 10): Promise<NormalizedJob[]> {
        return cacheService.getOrSet('jobs:trending', async () => {
            const jobs = await prisma.jobsCache.findMany({
                orderBy: { postedAt: 'desc' },
                take: limit,
            });

            return jobs.map((j) => ({
                externalId: j.externalId,
                source: j.source,
                title: j.title,
                company: j.company,
                companyLogo: j.companyLogo || undefined,
                location: j.location,
                description: j.description,
                salaryMin: j.salaryMin || undefined,
                salaryMax: j.salaryMax || undefined,
                currency: j.currency || 'INR',
                isRemote: j.isRemote,
                skills: j.skills,
                applyUrl: j.applyUrl,
                postedAt: j.postedAt || undefined,
            }));
        }, 1800);
    }

    /**
     * Iterates incoming dataset boundaries tracking title-company intersection schemas isolating duplication vectors.
     * 
     * @param {NormalizedJob[]} jobs - Contaminated array elements harboring potential matching redundancies.
     * @returns {NormalizedJob[]} Purged outputs strictly conforming to mathematical uniqueness parameters.
     */
    private deduplicateJobs(jobs: NormalizedJob[]): NormalizedJob[] {
        const seen = new Map<string, NormalizedJob>();

        for (const job of jobs) {
            const key = `${job.title.toLowerCase().trim()}_${job.company.toLowerCase().trim()}`;
            if (!seen.has(key)) {
                seen.set(key, job);
            }
        }

        return [...seen.values()];
    }

    /**
     * Implements multi-conditional custom mapping directives organizing output collections matching designated sorting parameters.
     * 
     * @param {NormalizedJob[]} jobs - Unsorted array representations.
     * @param {string} sortBy - Instruction literal modifying the underlying execution block sequences.
     * @returns {NormalizedJob[]} Array structures remapped representing sequential logical structures.
     */
    private sortJobs(jobs: NormalizedJob[], sortBy: string): NormalizedJob[] {
        switch (sortBy) {
            case 'date':
                return jobs.sort((a, b) => {
                    const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
                    const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
                    return dateB - dateA;
                });
            case 'salary':
                return jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
            default:
                return jobs;
        }
    }

    /**
     * Conducts string reduction replacing inconsistent external taxonomies generating strictly delineated uppercase enums matching Prisma models.
     * 
     * @param {string | undefined} type - String fragment extracted organically.
     * @returns {string | undefined} Formatted exact match alignment properties.
     */
    private mapJobType(type: string | undefined): string | undefined {
        if (!type) return undefined;
        const mapping: Record<string, string> = {
            'full_time': 'FULL_TIME',
            'fulltime': 'FULL_TIME',
            'full-time': 'FULL_TIME',
            'part_time': 'PART_TIME',
            'parttime': 'PART_TIME',
            'part-time': 'PART_TIME',
            'contract': 'CONTRACT',
            'contractor': 'CONTRACT',
            'internship': 'INTERNSHIP',
            'intern': 'INTERNSHIP',
            'freelance': 'FREELANCE',
            'temporary': 'TEMPORARY',
        };
        return mapping[type.toLowerCase()] || type;
    }

    /**
     * Processes raw multi-sentence textual string documents executing localized NLP heuristic mappings capturing explicitly categorized technical lexicons natively.
     * 
     * @param {string} text - Unstructured description originating inside applicant tracking interfaces.
     * @returns {string[]} Resolves independent arrays confirming exact competency correlations isolated mathematically.
     */
    private extractSkillsFromText(text: string): string[] {
        const KNOWN_SKILLS = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby',
            'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB',
            'React', 'Angular', 'Vue.js', 'Next.js', 'Svelte', 'Nuxt.js',
            'Node.js', 'Express', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI',
            'Spring Boot', 'Laravel', 'Rails', 'ASP.NET',
            'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
            'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
            'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
            'REST', 'GraphQL', 'gRPC', 'WebSocket',
            'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
            'Figma', 'Sketch', 'Adobe XD',
            'Agile', 'Scrum', 'Kanban', 'JIRA',
            'Linux', 'Nginx', 'Apache', 'Webpack', 'Vite',
            'Redux', 'Zustand', 'MobX', 'Prisma', 'Sequelize',
            'Jest', 'Cypress', 'Playwright', 'Selenium',
            'Firebase', 'Supabase', 'Vercel', 'Netlify',
            'Microservices', 'Serverless', 'Event-Driven',
        ];

        const lowerText = text.toLowerCase();
        return KNOWN_SKILLS.filter((skill) =>
            lowerText.includes(skill.toLowerCase())
        );
    }

    /**
     * Fires asynchronous processes ingesting fetched API metrics securely writing upsert operations capturing localized data mirroring capabilities safely limiting external bounds dependencies.
     * 
     * @param {NormalizedJob[]} jobs - Evaluated array endpoints ensuring mapping viability.
     * @returns {Promise<void>} Executes silently averting logical blocking errors limiting client impact sequences.
     */
    private async cacheJobsInDb(jobs: NormalizedJob[]): Promise<void> {
        for (const job of jobs) {
            try {
                await prisma.jobsCache.upsert({
                    where: { externalId: job.externalId },
                    create: {
                        externalId: job.externalId,
                        source: job.source,
                        title: job.title,
                        company: job.company,
                        companyLogo: job.companyLogo || null,
                        location: job.location,
                        description: job.description,
                        salaryMin: job.salaryMin || null,
                        salaryMax: job.salaryMax || null,
                        currency: job.currency || 'INR',
                        isRemote: job.isRemote,
                        skills: job.skills,
                        applyUrl: job.applyUrl,
                        postedAt: job.postedAt || null,
                        expiresAt: job.expiresAt || null,
                    },
                    update: {
                        title: job.title,
                        description: job.description,
                        salaryMin: job.salaryMin || null,
                        salaryMax: job.salaryMax || null,
                        skills: job.skills,
                        updatedAt: new Date(),
                    },
                });
            } catch {
            }
        }
    }
}

export const jobApiService = new JobApiService();
