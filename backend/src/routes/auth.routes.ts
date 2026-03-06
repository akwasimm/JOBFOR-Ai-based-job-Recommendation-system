/**
 * @module authRoutes
 * @description Orchestrates identity verification perimeters routing OAuth constraints alongside native JWT email authentication schemes securely.
 */
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { authController } from '@/controllers/auth.controller';
import { authMiddleware, authLimiter } from '@/middleware';
import { validate } from '@/middleware/validate';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema } from '@/validators/auth.validator';

const router = Router();

/**
 * ==========================================
 * Native Email/Password Authentication
 * ==========================================
 */

/**
 * @route POST /register
 * @description Initializes new user identity creating default relational bounds natively.
 * @access Public
 */
router.post('/register', validate(registerSchema), (req: Request, res: Response, next: NextFunction) => authController.register(req as any, res, next));

/**
 * @route POST /login
 * @description Cryptographically validates provided parameters resolving active JWT configurations.
 * @access Public
 */
router.post('/login', authLimiter, validate(loginSchema), (req: Request, res: Response, next: NextFunction) => authController.login(req as any, res, next));

/**
 * @route POST /refresh
 * @description Rotates expiring tokens providing subsequent access allocations seamlessly.
 * @access Public
 */
router.post('/refresh', validate(refreshTokenSchema), (req: Request, res: Response, next: NextFunction) => authController.refreshToken(req as any, res, next));

/**
 * @route POST /logout
 * @description Invalidates current token constraints neutralizing application access locally.
 * @access Private
 */
router.post('/logout', authMiddleware as any, (req: Request, res: Response, next: NextFunction) => authController.logout(req as any, res, next));

/**
 * @route GET /me
 * @description Resolves identity constraints extrapolating current caller identity attributes securely.
 * @access Private
 */
router.get('/me', authMiddleware as any, (req: Request, res: Response, next: NextFunction) => authController.me(req as any, res, next));

/**
 * @route POST /forgot-password
 * @description Triggers asynchronous SMTP logic distributing reset parameters.
 * @access Public
 */
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), (req: Request, res: Response, next: NextFunction) => authController.forgotPassword(req as any, res, next));

/**
 * @route POST /reset-password
 * @description Re-keys cryptographic identity resolving new password credentials.
 * @access Public
 */
router.post('/reset-password', validate(resetPasswordSchema), (req: Request, res: Response, next: NextFunction) => authController.resetPassword(req as any, res, next));

/**
 * ==========================================
 * Google OAuth Integration
 * ==========================================
 */

/**
 * @route GET /google
 * @description Initiates redirect bounds navigating client via Google Identity Platform protocols.
 * @access Public
 */
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @route GET /google/callback
 * @description Intercepts identity redirects finalizing registration/login logic securely.
 * @access Public
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req: Request, res: Response, next: NextFunction) => authController.oauthCallback(req as any, res, next)
);

/**
 * ==========================================
 * GitHub OAuth Integration
 * ==========================================
 */

/**
 * @route GET /github
 * @description Submits authorization requests navigating standard developer platform OAuth constraints.
 * @access Public
 */
router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @route GET /github/callback
 * @description Resolves provider authorization codes generating synchronized application tokens securely.
 * @access Public
 */
router.get(
    '/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    (req: Request, res: Response, next: NextFunction) => authController.oauthCallback(req as any, res, next)
);

export default router;
