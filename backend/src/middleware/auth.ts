import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { verifyToken } from '@/utils/jwt';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/helpers';

/**
 * Extracts and cryptographically verifies active JWT instances asserting relational identity bindings against incoming requests securely.
 * 
 * @param {AuthRequest} req - Mutated Express request object supporting embedded user context propagation natively.
 * @param {Response} _res - Standard Express response object (unused natively within this boundary context).
 * @param {NextFunction} next - Execution chain progression callback indicating successful context binding or emitting validation errors globally.
 * @returns {Promise<void>} Resolves resolving execution forwarding natively avoiding termination states seamlessly.
 * @throws {AppError} Distinct numeric indicators capturing missing headers (401), invalid format logic (401), missing records (401), expired sequences (401), or invalid signatures (401).
 */
export async function authMiddleware(
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            throw new AppError('User not found.', 401);
        }

        req.user = user;
        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            next(new AppError('Invalid token.', 401));
        } else if (error.name === 'TokenExpiredError') {
            next(new AppError('Token expired.', 401));
        } else {
            next(error);
        }
    }
}

/**
 * Validates header contexts resolving valid identity signatures without blocking missing anonymous requests enforcing personalization optionally.
 * 
 * @param {AuthRequest} req - Target parameter supporting conditional mutation inserting verifiable identity maps where applicable securely.
 * @param {Response} _res - Standard output execution block isolated natively.
 * @param {NextFunction} next - Guarantees progression execution bypassing validation traps securely allowing anonymous traversal.
 * @returns {Promise<void>} Concludes sequence evaluation asynchronously natively seamlessly.
 */
export async function optionalAuth(
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });
            if (user) req.user = user;
        }

        next();
    } catch {
        next();
    }
}

/**
 * Instantiates higher-order boundaries computing explicitly asserted categorical strings verifying structural identity roles preemptively.
 * 
 * @param {...string[]} roles - Categorical hierarchy components resolving explicit gatekeeper logic securely.
 * @returns {Function} Express routing logic establishing stringent termination states identifying incomplete or restricted scopes natively.
 */
export function requireRole(...roles: string[]) {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Access denied. No user.', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Access denied. Insufficient permissions.', 403));
        }

        next();
    };
}
