import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { prisma } from '@/config/database';

/**
 * Controller class governing asynchronous engagement indicators, asynchronous polling mechanisms, 
 * and localized event sourcing interactions directed at individual authenticated identities.
 * 
 * @class NotificationController
 */
export class NotificationController {
    /**
     * Restores paginated ledger elements reflecting transactional and programmatic interactions generated downstream.
     * 
     * @param {AuthRequest} req - Extracts specific query limits delineating readout volumes.
     * @param {Response} res - Dispatches arrays representing historical asynchronous touchpoints.
     * @param {NextFunction} next - Top-level sequence handler for exception catch delegation.
     */
    async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const unreadOnly = req.query.unreadOnly === 'true';

            const notifications = await prisma.notification.findMany({
                where: {
                    userId: req.user!.id,
                    ...(unreadOnly ? { isRead: false } : {}),
                },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });

            res.json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mutates persistence structures updating Boolean flags confirming endpoint receipt and acknowledgement.
     * 
     * @param {AuthRequest} req - Captures primary pointer keys locating distinct notification artifacts.
     * @param {Response} res - Return mechanism validating correct execution paths.
     * @param {NextFunction} next - Bridging pipeline callback for fault propagation.
     */
    async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const notificationId = parseInt(String(req.params.id), 10);

            await prisma.notification.updateMany({
                where: { id: notificationId, userId: req.user!.id },
                data: { isRead: true },
            });

            res.json({ success: true, message: 'Notification marked as read' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Executes bulk transactional operations traversing unbounded schema collections standardizing acknowledgment properties.
     * 
     * @param {AuthRequest} req - Provides foundational context restricting manipulation boundaries to instantiated tenants.
     * @param {Response} res - Confirms total synchronous completion across relevant identity tables.
     * @param {NextFunction} next - Pass-through mechanism dispatching error metadata.
     */
    async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await prisma.notification.updateMany({
                where: { userId: req.user!.id, isRead: false },
                data: { isRead: true },
            });

            res.json({ success: true, message: 'All notifications marked as read' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Implements hard deletion protocols irrevocably severing linkage arrays to instantiated notification structures.
     * 
     * @param {AuthRequest} req - Transport encapsulating destructive targets mapping to historical signals.
     * @param {Response} res - Dispatches affirmation reflecting accurate database purging.
     * @param {NextFunction} next - General unhandled error intercept endpoint.
     */
    async deleteNotification(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const notificationId = parseInt(String(req.params.id), 10);

            await prisma.notification.deleteMany({
                where: { id: notificationId, userId: req.user!.id },
            });

            res.json({ success: true, message: 'Notification deleted' });
        } catch (error) {
            next(error);
        }
    }
}

export const notificationController = new NotificationController();
