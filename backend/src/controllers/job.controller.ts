import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { jobApiService } from '@/services/jobApi.service';
import { recommendationService } from '@/services/recommendation.service';
import { prisma } from '@/config/database';

/**
 * Controller class orchestrating HTTP transport operations related to job entity lifecycle
 * activities and aggregation protocols. Integrates dependency services for business logic delegation.
 * 
 * @class JobController
 */
export class JobController {
    /**
     * Process search query attributes targeting the centralized job repository, surfacing
     * paginated metadata subsets and user-specific match scores where applicable.
     * 
     * @param {AuthRequest} req - Application request context enclosing query configuration.
     * @param {Response} res - Dispatchable channel for JSON serialization and HTTP response bridging.
     * @param {NextFunction} next - Upstream pipeline execution callback mechanism for error propagation.
     */
    async searchJobs(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await jobApiService.searchJobs(req.query as any);

            if (req.user) {
                const profile = await prisma.profile.findUnique({
                    where: { userId: req.user.id },
                    include: {
                        skills: { include: { skill: true } },
                        workExperience: true,
                    },
                });

                if (profile) {
                    result.jobs = result.jobs.map((job) => {
                        const breakdown = recommendationService.calculateMatchBreakdown(profile, job);
                        return { ...job, matchScore: breakdown.overallScore, matchBreakdown: breakdown };
                    });
                }
            }

            res.json({
                success: true,
                data: result.jobs,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Facilitates execution of primary key lookup workflows to resolve singleton job records.
     * 
     * @param {AuthRequest} req - Includes routing path identity parameter.
     * @param {Response} res - Dispatches underlying entity JSON to invoking consumers.
     * @param {NextFunction} next - Routing interceptor logic callback for exceptional behaviors.
     */
    async getJobById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const job = await jobApiService.getJobById(req.params.id as string);

            if (!job) {
                res.status(404).json({ success: false, error: 'Job not found' });
                return;
            }

            res.json({ success: true, data: job });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Extrapolates aggregated metrics prioritizing prevalent or trending job entity vectors.
     * 
     * @param {AuthRequest} req - Application request encompassing optional ceiling constraints.
     * @param {Response} res - Success channel for disseminating sorted array sequences.
     * @param {NextFunction} next - Asynchronous error forwarding function.
     */
    async getTrendingJobs(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const jobs = await jobApiService.getTrendingJobs(limit);

            res.json({ success: true, data: jobs });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Invokes the internal algorithmic scoring subsystems to derive explicitly curated opportunities.
     * 
     * @param {AuthRequest} req - Restrictive request interface mandating valid user identity instantiation.
     * @param {Response} res - Delivers optimized suggestions back to client topologies.
     * @param {NextFunction} next - Pass-through mechanism dispatching error metadata to generic handlers.
     */
    async getRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const recommendations = await recommendationService.getRecommendations(
                req.user!.id,
                limit
            );

            res.json({ success: true, data: recommendations });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Identifies proximate job objects modeled mathematically adjacent to an arbitrary baseline input job.
     * 
     * @param {AuthRequest} req - Parametrized payload capturing the source comparative identifier.
     * @param {Response} res - Emits the collection of highly clustered neighboring entity items.
     * @param {NextFunction} next - Middleware traversal instruction handler for faults.
     */
    async getSimilarJobs(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const jobs = await recommendationService.getSimilarJobs(req.params.id as string, limit);

            res.json({ success: true, data: jobs });
        } catch (error) {
            next(error);
        }
    }
}

export const jobController = new JobController();
