/**
 * @module RootRouter
 * @description Master routing aggregator initializing and mounting subsystem route groups onto global path prefixes.
 */
import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import jobRoutes from './job.routes';
import applicationRoutes from './application.routes';
import aiCoachRoutes from './aiCoach.routes';
import insightsRoutes from './insights.routes';
import notificationRoutes from './notification.routes';

const router = Router();

/**
 * Mount points mapping discrete domains towards dedicated functional router modules ensuring isolation comprehensively.
 */
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/ai-coach', aiCoachRoutes);
router.use('/insights', insightsRoutes);
router.use('/notifications', notificationRoutes);

export default router;
