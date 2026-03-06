/**
 * @module applicationRoutes
 * @description Defines routing vectors for user job applications, saved jobs, and real-time job alerts management.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { applicationController } from '@/controllers/application.controller';
import { authMiddleware } from '@/middleware';
import { validate } from '@/middleware/validate';
import { saveJobSchema, applyJobSchema, updateApplicationStatusSchema } from '@/validators/profile.validator';

const router = Router();

// Enforce authentication context globally across this route domain
router.use(authMiddleware as any);

/**
 * Encapsulates execution logic preventing unhandled promise rejections crashing the runtime context.
 * @param {Function} fn - Target controller payload.
 * @returns {Function} Context-bound express handler.
 */
const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) => fn.call(applicationController, req, res, next);

/**
 * ==========================================
 * Saved Jobs Management
 * ==========================================
 */

/**
 * @route POST /saved
 * @description Bookmarks a target job opportunity for future retrieval.
 * @access Private
 */
router.post('/saved', validate(saveJobSchema), wrap(applicationController.saveJob));

/**
 * @route GET /saved
 * @description Retrieves a paginated list of all currently bookmarked job records.
 * @access Private
 */
router.get('/saved', wrap(applicationController.getSavedJobs));

/**
 * @route DELETE /saved/external/:jobId
 * @description Removes a specific bookmark association using external API job IDs.
 * @access Private
 */
router.delete('/saved/external/:jobId', wrap(applicationController.unsaveJobByExternalId));

/**
 * @route DELETE /saved/:id
 * @description Removes a specific bookmark association breaking the retention linkage.
 * @access Private
 */
router.delete('/saved/:id', wrap(applicationController.unsaveJob));

/**
 * ==========================================
 * Application Management
 * ==========================================
 */

/**
 * @route POST /apply
 * @description Submits a formal employment petition towards a specified job listing.
 * @access Private
 */
router.post('/apply', validate(applyJobSchema), wrap(applicationController.applyToJob));

/**
 * @route GET /
 * @description Yields historical application submissions and their current external statuses.
 * @access Private
 */
router.get('/', wrap(applicationController.getApplications));

/**
 * @route PATCH /:id/status
 * @description Mutates the internal state representation of a specific application occurrence.
 * @access Private
 */
router.patch('/:id/status', validate(updateApplicationStatusSchema), wrap(applicationController.updateApplicationStatus));

/**
 * ==========================================
 * Metrics & Analytics
 * ==========================================
 */

/**
 * @route GET /stats
 * @description Extracts aggregated application volumes isolating funnel velocities.
 * @access Private
 */
router.get('/stats', wrap(applicationController.getStats));

/**
 * ==========================================
 * Job Alert Configurations
 * ==========================================
 */

/**
 * @route POST /alerts
 * @description Instantiates notification subscriptions binding specific queries against cron monitoring.
 * @access Private
 */
router.post('/alerts', wrap(applicationController.createAlert));

/**
 * @route GET /alerts
 * @description Retrieves active notification subscriptions.
 * @access Private
 */
router.get('/alerts', wrap(applicationController.getAlerts));

/**
 * @route DELETE /alerts/:id
 * @description Destroys notification subscriptions halting subsequent automated deliveries.
 * @access Private
 */
router.delete('/alerts/:id', wrap(applicationController.deleteAlert));

export default router;
