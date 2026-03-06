/**
 * @module insightsRoutes
 * @description Exposes analytical indices detailing market trends, salary distributions, and algorithmic skill gap comparisons.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { insightsController } from '@/controllers/insights.controller';
import { authMiddleware, optionalAuth } from '@/middleware';

const router = Router();

/**
 * Controller execution layer preventing unhandled errors triggering node process termination sequences globally.
 * @param {Function} fn - Isolated controller routine binding.
 * @returns {Function} Express compliant execution binding.
 */
const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) => fn.call(insightsController, req, res, next);

/**
 * ==========================================
 * Public & Optionally Authenticated Analytics
 * ==========================================
 */

/**
 * @route GET /salary
 * @description Retrieves statistical salary boundaries optionally tailored utilizing current user context.
 * @access Public (Optional Auth)
 */
router.get('/salary', optionalAuth as any, wrap(insightsController.getSalaryInsights));

/**
 * @route GET /skills
 * @description Maps technical terminology demand rates against localized profile competences optionally.
 * @access Public (Optional Auth)
 */
router.get('/skills', optionalAuth as any, wrap(insightsController.getSkillDemand));

/**
 * @route GET /trends
 * @description Compiles temporal hiring volume indices indicating overarching market trajectories definitively.
 * @access Public
 */
router.get('/trends', wrap(insightsController.getMarketTrends));

/**
 * @route GET /companies
 * @description Ranks corporate entities predicated on concurrent mass hiring initiatives dynamically.
 * @access Public
 */
router.get('/companies', wrap(insightsController.getCompanyInsights));

/**
 * ==========================================
 * Protected Personalized Analytics
 * ==========================================
 */

/**
 * @route GET /skill-gap
 * @description Synthesizes Cartesian difference models evaluating required technical competences versus explicit user capabilities.
 * @access Private
 */
router.get('/skill-gap', authMiddleware as any, wrap(insightsController.getSkillGap));

export default router;
