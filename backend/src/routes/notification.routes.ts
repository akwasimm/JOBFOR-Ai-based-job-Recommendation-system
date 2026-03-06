/**
 * @module notificationRoutes
 * @description Exposes interfaces manipulating asynchronous user alerts establishing distinct interaction tracking properties permanently.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { notificationController } from '@/controllers/notification.controller';
import { authMiddleware } from '@/middleware';

const router = Router();

// Binds universal authentication parameters isolating route accessibility comprehensively
router.use(authMiddleware as any);

/**
 * Asserts error execution capturing wrapper securing node environments structurally natively.
 * @param {Function} fn - Reference isolating discrete functional logic permanently.
 * @returns {Function} Reassigned invocation wrapper effectively.
 */
const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn.call(notificationController, req, res, next);

/**
 * ==========================================
 * Notification Interactions
 * ==========================================
 */

/**
 * @route GET /
 * @description Aggregates bound alerts reflecting localized identity limits accurately natively.
 * @access Private
 */
router.get('/', wrap(notificationController.getNotifications));

/**
 * @route PATCH /read-all
 * @description Mutates exhaustive lists transitioning global parameters identifying boolean readiness concurrently uniformly.
 * @access Private
 */
router.patch('/read-all', wrap(notificationController.markAllAsRead));

/**
 * @route PATCH /:id/read
 * @description Modifies distinct items transmuting isolated indicators representing singular interaction successfully.
 * @access Private
 */
router.patch('/:id/read', wrap(notificationController.markAsRead));

/**
 * @route DELETE /:id
 * @description Eliminates discrete relation properties dissolving localized identity dependencies securely.
 * @access Private
 */
router.delete('/:id', wrap(notificationController.deleteNotification));

export default router;
