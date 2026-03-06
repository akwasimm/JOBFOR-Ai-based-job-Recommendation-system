import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { marketInsightsService } from '@/services/marketInsights.service';

/**
 * Controller class facilitating exposure of macroscopic statistical aggregations and heuristic 
 * inferences modeling labor market economic dynamics and localized trend surfaces.
 * 
 * @class InsightsController
 */
export class InsightsController {
    /**
     * Translates contextual criteria into statistical compensation brackets leveraging multi-axis comparative arrays.
     * 
     * @param {AuthRequest} req - Application context delivering requisite parameter matrices.
     * @param {Response} res - Dispatches serialized intelligence vectors denoting median and percentile bounds.
     * @param {NextFunction} next - Pass-through mechanism dispatching error metadata to generic handlers.
     */
    async getSalaryInsights(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { role, location } = req.query as { role: string; location?: string };
            const insights = await marketInsightsService.getSalaryInsights(role, location);

            res.json({ success: true, data: insights });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Executes queries retrieving unified structural arrays of retained entity representations mapping
     * temporal frequency of requested corporate proficiencies.
     * 
     * @param {AuthRequest} req - Request container linking active user contextual schemas.
     * @param {Response} res - Relays sorted JSON payload datasets establishing volumetric metrics.
     * @param {NextFunction} next - Upstream pipeline execution callback mechanism for error propagation.
     */
    async getSkillDemand(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const demand = await marketInsightsService.getSkillDemand(userId);

            res.json({ success: true, data: demand });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves high-level state representations tracking overarching macro-level trajectories across sector topologies.
     * 
     * @param {AuthRequest} req - Baseline request validating authenticated user provenance.
     * @param {Response} res - Resolves structural collections defining widespread market shifts.
     * @param {NextFunction} next - Middleware traversal instruction handler for faults.
     */
    async getMarketTrends(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trends = await marketInsightsService.getMarketTrends();
            res.json({ success: true, data: trends });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Acquires transactional histories and differential diagnostics to isolate capability deficits between applicant vectors.
     * 
     * @param {AuthRequest} req - Transport incorporating specific targeted baseline coordinates.
     * @param {Response} res - Emits abstract mathematical differences bounding individual upskilling avenues.
     * @param {NextFunction} next - Default execution context intercept.
     */
    async getSkillGap(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const targetRole = req.query.role as string | undefined;
            const gap = await marketInsightsService.getSkillGap(req.user!.id, targetRole);

            res.json({ success: true, data: gap });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generates aggregated mathematical insights distilling structural and sentiment factors across business ecosystems.
     * 
     * @param {AuthRequest} req - Request encompassing optional volumetric constraints restricting JSON serialization.
     * @param {Response} res - Transmits validated record blocks reflecting organizational heuristics.
     * @param {NextFunction} next - Traversal instruction node escalating programmatic faults.
     */
    async getCompanyInsights(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(String(req.query.limit || '20'), 10);
            const companies = await marketInsightsService.getCompanyInsights(limit);
            res.json({ success: true, data: companies });
        } catch (error) {
            next(error);
        }
    }
}

export const insightsController = new InsightsController();
