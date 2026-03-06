/**
 * @module aiCoachRoutes
 * @description Exposes RESTful endpoints for the AI Coach subsystem.
 * Handles chat interactions, session management, and specialized AI-driven career services.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { aiCoachController } from '@/controllers/aiCoach.controller';
import { authMiddleware, aiLimiter } from '@/middleware';
import { validate } from '@/middleware/validate';
import { chatMessageSchema } from '@/validators/profile.validator';

const router = Router();

// Apply authentication middleware to all routes in this module
router.use(authMiddleware as any);

/**
 * Utility wrapper to handle async controller methods.
 * @param {Function} fn - Controller function.
 * @returns {Function} Express middleware.
 */
const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) => fn.call(aiCoachController, req, res, next);

/**
 * ==========================================
 * Chat & Specialized AI Services
 * ==========================================
 */

/**
 * @route POST /chat
 * @description Submits a conversational message to the AI coach.
 * @access Private
 */
router.post('/chat', aiLimiter, validate(chatMessageSchema), wrap(aiCoachController.chat));

/**
 * @route POST /resume-review
 * @description Analyzes user resume data and provides AI-generated feedback.
 * @access Private
 */
router.post('/resume-review', aiLimiter, wrap(aiCoachController.reviewResume));

/**
 * @route POST /cover-letter
 * @description Generates a tailored cover letter based on user profile and target job description.
 * @access Private
 */
router.post('/cover-letter', aiLimiter, wrap(aiCoachController.generateCoverLetter));

/**
 * @route POST /interview-prep
 * @description Conducts a mock interview session or provides interview preparation materials.
 * @access Private
 */
router.post('/interview-prep', aiLimiter, wrap(aiCoachController.interviewPrep));

/**
 * @route POST /salary-negotiation
 * @description Simulates salary negotiation scenarios or provides guidance based on market data.
 * @access Private
 */
router.post('/salary-negotiation', aiLimiter, wrap(aiCoachController.salaryNegotiation));

/**
 * @route POST /career-path
 * @description Charts potential career trajectories given current user skills and market trends.
 * @access Private
 */
router.post('/career-path', aiLimiter, wrap(aiCoachController.careerPath));

/**
 * ==========================================
 * Session Management
 * ==========================================
 */

/**
 * @route GET /sessions
 * @description Retrieves all active and historical chat sessions for the authenticated user.
 * @access Private
 */
router.get('/sessions', wrap(aiCoachController.getChatSessions));

/**
 * @route GET /sessions/:sessionId
 * @description Retrieves the detailed message history for a specific chat session.
 * @access Private
 */
router.get('/sessions/:sessionId', wrap(aiCoachController.getChatHistory));

/**
 * @route DELETE /sessions/:sessionId
 * @description Irreversibly purges a specific chat session and its associated history.
 * @access Private
 */
router.delete('/sessions/:sessionId', wrap(aiCoachController.deleteChatSession));

export default router;
