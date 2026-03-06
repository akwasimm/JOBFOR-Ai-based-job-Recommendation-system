import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/helpers';
import { env } from '@/config/env';

/**
 * Consolidates global unhandled application exception bubbling executing structured client-facing responses distinguishing isolated runtime crashes safely preventing sensitive data exposition inherently.
 * 
 * @param {Error | AppError} err - Captured runtime execution state comprising either constructed AppError types defining distinct status logic or native unexpected engine exceptions globally.
 * @param {Request} _req - Intercepted input parameters evaluating original routing intents fundamentally.
 * @param {Response} res - Interstitial termination logic returning JSON structured validation metrics definitively terminating active requests.
 * @param {NextFunction} _next - Halts execution sequence avoiding circular downstream failures effectively.
 * @returns {void} Explicit logic boundary enforcing absolute termination behaviors universally.
 */
export function errorHandler(
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }

    console.error('❌ Unexpected error:', err);

    const message =
        env.NODE_ENV === 'development'
            ? err.message
            : 'An unexpected error occurred';

    res.status(500).json({
        success: false,
        error: message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

/**
 * Enforces strict routing validation bounding returning explicit NOT FOUND state models when incoming path targets remain unallocated structurally avoiding unmapped engine locking sequences reliably.
 * 
 * @param {Request} req - Transmits incoming unmatched trajectory resolving absolute path combinations effectively natively.
 * @param {Response} _res - Standard operational boundary avoiding native unhandled exception timeouts logically.
 * @param {NextFunction} next - Instantiates the constructed AppError feeding directly into the unified errorHandler boundary.
 * @returns {void} Relays execution natively into subsequent downstream captures definitively.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}
