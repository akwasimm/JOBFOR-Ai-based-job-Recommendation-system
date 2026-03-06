/**
 * @module jobRoutes
 * @description Coordinates job related APIs, supporting high-throughput search filtering, targeting trending data, and personalized recommendations.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { jobController } from '@/controllers/job.controller';
import { authMiddleware, optionalAuth } from '@/middleware';
import { validate } from '@/middleware/validate';
import { jobSearchSchema } from '@/validators/profile.validator';

const router = Router();

/**
 * Instantiates centralized error handling bounding runtime execution.
 * @param {Function} fn - Controller methodology reference natively.
 * @returns {Function} Wrapped execution parameter seamlessly handling failure resolution dynamically.
 */
const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) => fn.call(jobController, req, res, next);

/**
 * ==========================================
 * Public Job Discovery
 * ==========================================
 */

/**
 * @route GET /search
 * @description Generates localized job results filtering parameters using text searching natively over cached nodes.
 * @access Public
 */
router.get('/search', validate(jobSearchSchema, 'query'), wrap(jobController.searchJobs));

/**
 * @route GET /trending
 * @description Acquires temporally relevant postings demonstrating high velocity interactions globally.
 * @access Public
 */
router.get('/trending', wrap(jobController.getTrendingJobs));

/**
 * @route GET /:id
 * @description Retrieves precise entity information extracting single bounded database identifiers precisely.
 * @access Public
 */
router.get('/:id', wrap(jobController.getJobById));

/**
 * @route GET /:id/similar
 * @description Models associative lists discovering peer records overlapping primarily through technical competence requests computationally.
 * @access Public
 */
router.get('/:id/similar', wrap(jobController.getSimilarJobs));

/**
 * ==========================================
 * Protected Job Discovery
 * ==========================================
 */

/**
 * @route GET /user/recommendations
 * @description Queries inferential services cross-referencing user profile structures outputting highly targeted tailored lists computationally.
 * @access Private
 */
router.get('/user/recommendations', authMiddleware as any, wrap(jobController.getRecommendations));

export default router;
