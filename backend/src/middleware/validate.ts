import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Generates factory bindings evaluating diverse payload permutations applying discrete Zod compilation matrices guaranteeing rigid structural schemas mapping against isolated target bodies consistently.
 * 
 * @param {ZodSchema} schema - Established structural parameters establishing bounds against specific variable types securely.
 * @param {'body' | 'query' | 'params'} [source='body'] - Dictates explicit targeted extraction targets extracting values fundamentally ensuring accurate location analysis.
 * @returns {Function} Express compliant methodology substituting invalid matrices triggering HTTP 400 response cycles autonomously replacing successful coercion into root scopes.
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = schema.parse(req[source]);
            req[source] = data;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
}
