import { prisma } from '@/config/database';
import { cacheService } from './cache.service';
import { SalaryInsight, SkillDemand, MarketTrend } from '@/types';

/**
 * Enterprise service isolating advanced analytical processes targeting massive scale transactional datasets, 
 * utilizing deep aggregation and interpolation determining broader corporate metrics and market patterns natively.
 * 
 * @class MarketInsightsService
 */
export class MarketInsightsService {
    /**
     * Interrogates underlying persistent data hierarchies extracting normalized multi-currency bounds interpolating fractional median thresholds.
     * 
     * @param {string} role - Taxonomic identifier encapsulating baseline classification parameters.
     * @param {string} [location] - Distinct coordinate or municipal bound reducing localized bias distributions.
     * @returns {Promise<SalaryInsight>} Encapsulated statistical bounds representing definitive fiscal analysis components.
     */
    async getSalaryInsights(role: string, location?: string): Promise<SalaryInsight> {
        const cacheKey = `insights:salary:${role}:${location || 'all'}`;

        return cacheService.getOrSet(cacheKey, async () => {
            const jobs = await prisma.jobsCache.findMany({
                where: {
                    title: { contains: role, mode: 'insensitive' },
                    ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
                    salaryMin: { not: null },
                },
                select: { salaryMin: true, salaryMax: true, currency: true },
            });

            if (jobs.length === 0) {
                return {
                    role,
                    location: location || 'All',
                    min: 0,
                    median: 0,
                    max: 0,
                    currency: 'INR',
                    sampleSize: 0,
                };
            }

            const salaries = jobs
                .map((j: { salaryMin: number | null; salaryMax: number | null; currency: string | null }) => ((j.salaryMin || 0) + (j.salaryMax || j.salaryMin || 0)) / 2)
                .sort((a: number, b: number) => a - b);

            const mid = Math.floor(salaries.length / 2);
            const median =
                salaries.length % 2 !== 0
                    ? salaries[mid]
                    : (salaries[mid - 1] + salaries[mid]) / 2;

            return {
                role,
                location: location || 'All',
                min: Math.round(salaries[0]),
                median: Math.round(median),
                max: Math.round(salaries[salaries.length - 1]),
                currency: jobs[0].currency || 'INR',
                sampleSize: jobs.length,
            };
        }, 3600);
    }

    /**
     * Implements array parsing mechanisms cross-referencing extracted competency lexicons comparing proportional volumes determining market demand values relative to tenant skill arrays.
     * 
     * @param {number} [userId] - Identifies subject parameters merging localized metrics alongside generic computations.
     * @returns {Promise<SkillDemand[]>} Descending structured dictionary identifying prevalent technical lexicons iteratively.
     */
    async getSkillDemand(userId?: number): Promise<SkillDemand[]> {
        const cacheKey = `insights:skilldemand:${userId || 'general'}`;

        return cacheService.getOrSet(cacheKey, async () => {
            const jobs = await prisma.jobsCache.findMany({
                select: { skills: true },
                take: 500,
                orderBy: { postedAt: 'desc' },
            });

            const totalJobs = jobs.length;
            if (totalJobs === 0) return [];

            const skillCounts = new Map<string, number>();
            for (const job of jobs) {
                for (const skill of job.skills) {
                    const lower = skill.toLowerCase();
                    skillCounts.set(lower, (skillCounts.get(lower) || 0) + 1);
                }
            }

            let userSkillNames: string[] = [];
            if (userId) {
                const profile = await prisma.profile.findUnique({
                    where: { userId },
                    include: { skills: { include: { skill: true } } },
                });
                userSkillNames = (profile?.skills || []).map((s: any) => s.skill.name.toLowerCase());
            }

            const demands: SkillDemand[] = [...skillCounts.entries()]
                .map(([skill, count]) => ({
                    skill,
                    demandPercentage: Math.round((count / totalJobs) * 100),
                    trend: 'stable' as const,
                    userHasSkill: userSkillNames.includes(skill),
                }))
                .sort((a, b) => b.demandPercentage - a.demandPercentage)
                .slice(0, 30);

            return demands;
        }, 3600);
    }

    /**
     * Conducts expansive temporal tracking extrapolating macro velocity vectors modeling total available endpoints distinguishing unique institutional contributors explicitly.
     * 
     * @returns {Promise<MarketTrend>} Analytical bounds enclosing overall system breadth definitions alongside temporal velocity shifts.
     */
    async getMarketTrends(): Promise<MarketTrend> {
        return cacheService.getOrSet('insights:trends', async () => {
            const totalJobs = await prisma.jobsCache.count();

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newToday = await prisma.jobsCache.count({
                where: { createdAt: { gte: today } },
            });

            const companyCounts = await prisma.jobsCache.groupBy({
                by: ['company'],
                _count: { company: true },
                orderBy: { _count: { company: 'desc' } },
                take: 10,
            });

            return {
                totalJobs,
                newToday,
                growthPercentage: 0,
                topHiringCompanies: companyCounts.map((c: any) => ({
                    name: c.company,
                    openings: c._count.company,
                })),
            };
        }, 1800);
    }

    /**
     * Utilizes Cartesian set logic calculating proportional distances dividing individual topological capability metrics against corporate prerequisites forming actionable instructional vectors.
     * 
     * @param {number} userId - Targets individualized metrics grounding complex difference calculations mathematically.
     * @param {string} [targetRole] - Denotes categorical target domains matching isolated corporate expectations natively.
     * @returns {Promise<any>} Resolves intersecting indices outputting structured maps denoting deficiency factors definitively.
     */
    async getSkillGap(userId: number, targetRole?: string) {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { skills: { include: { skill: true } } },
        });

        if (!profile) return { userSkills: [], requiredSkills: [], gaps: [], match: 0 };

        const whereClause = targetRole
            ? { title: { contains: targetRole, mode: 'insensitive' as const } }
            : {};

        const jobs = await prisma.jobsCache.findMany({
            where: whereClause,
            select: { skills: true },
            take: 100,
        });

        const requiredSkillCounts = new Map<string, number>();
        for (const job of jobs) {
            for (const skill of job.skills) {
                const lower = skill.toLowerCase();
                requiredSkillCounts.set(lower, (requiredSkillCounts.get(lower) || 0) + 1);
            }
        }

        const userSkillNames = new Set(
            (profile.skills || []).map((s: any) => s.skill.name.toLowerCase())
        );

        const topRequired = [...requiredSkillCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

        const gaps = topRequired
            .filter(([skill]) => !userSkillNames.has(skill))
            .map(([skill, count]) => ({
                skill,
                demandPercentage: Math.round((count / jobs.length) * 100),
            }));

        const matchCount = topRequired.filter(([skill]) => userSkillNames.has(skill)).length;
        const matchPercentage = topRequired.length > 0 ? Math.round((matchCount / topRequired.length) * 100) : 0;

        return {
            userSkills: [...userSkillNames],
            requiredSkills: topRequired.map(([skill, count]) => ({
                skill,
                demandPercentage: Math.round((count / jobs.length) * 100),
            })),
            gaps,
            match: matchPercentage,
        };
    }

    /**
     * Translates deep hierarchical relational counts projecting institutional volumes identifying organizational environments executing scaled mass-requisition initiatives utilizing raw Postgres aggregates.
     * 
     * @param {number} [limit=20] - Designates absolute matrix boundary constraints bounding response array lengths systematically.
     * @returns {Promise<any[]>} Collections presenting overarching institutional topologies flagged dynamically based on mathematical limits.
     */
    async getCompanyInsights(limit: number = 20): Promise<any[]> {
        const cacheKey = `insights:companies:${limit}`;
        const cached = await cacheService.get<any[]>(cacheKey);
        if (cached) return cached;

        const companies = await prisma.$queryRaw<any[]>`
            SELECT
                company,
                COUNT(*) as job_count,
                MIN(salary_min) as salary_min,
                MAX(salary_max) as salary_max,
                BOOL_OR(is_remote) as has_remote
            FROM jobs_cache
            WHERE posted_at > NOW() - INTERVAL '30 days'
            GROUP BY company
            ORDER BY job_count DESC
            LIMIT ${limit}
        `;

        const result = companies.map((c: any) => ({
            company: c.company,
            jobCount: Number(c.job_count),
            isMassHiring: Number(c.job_count) >= 20,
            salaryRange: { min: c.salary_min, max: c.salary_max },
            hasRemote: c.has_remote,
        }));

        await cacheService.set(cacheKey, result, 3600);
        return result;
    }
}

export const marketInsightsService = new MarketInsightsService();
