import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { authService } from '@/services/auth.service';

/**
 * Controller class adjudicating cryptographic access, session generation constraints, and identity integrity 
 * mechanisms aligning system perimeters with established principal models.
 * 
 * @class AuthController
 */
export class AuthController {
    /**
     * Enacts initial instantiation of user entity persistence schemas incorporating BCrypt hashing principles.
     * 
     * @param {AuthRequest} req - Client request encompassing raw principal authentication assertions.
     * @param {Response} res - Outputs corresponding secure token schemas and initialized metadata profiles.
     * @param {NextFunction} next - Middleware delegation router triggering subsequent validation exceptions.
     */
    async register(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Executes strict comparative evaluation sequences against hashed temporal storage, subsequently generating 
     * JSON Web Token payloads facilitating extended stateless interaction models.
     * 
     * @param {AuthRequest} req - Application context delivering standard HTTP payload mappings.
     * @param {Response} res - Assigns encrypted access layers distributing structural security.
     * @param {NextFunction} next - Upstream pipeline execution callback mechanism for error propagation.
     */
    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);

            res.json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Validates long-lived persistence keys executing asymmetrical issuance of ephemeral bearer token objects 
     * enabling non-interactive continuation of administrative scope.
     * 
     * @param {AuthRequest} req - Encapsulates rotational identification keys indicating continued validity.
     * @param {Response} res - Propagates sequentially re-signed cryptographic strings ensuring continuity.
     * @param {NextFunction} next - Internal fallback hook for operational anomaly propagation.
     */
    async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Revokes operational trust protocols eliminating backend cached validation mappings for designated key signatures.
     * 
     * @param {AuthRequest} req - Delivers authenticated metadata guaranteeing localized scope authority.
     * @param {Response} res - Dispatchable channel terminating programmatic interactions systematically.
     * @param {NextFunction} next - Diagnostics dispatcher mitigating unrecoverable process faults.
     */
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (req.user) {
                await authService.logout(req.user.id);
            }

            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Yields unredacted personal topography resolving localized structural data exclusive to instantiated session subjects.
     * 
     * @param {AuthRequest} req - Evaluated request token affirming analytic scope permissions.
     * @param {Response} res - Relays isolated identity definitions to interface components.
     * @param {NextFunction} next - Standard error isolation pipeline connector.
     */
    async me(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await authService.getCurrentUser(req.user!.id);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Facilitates external identity provider proxy convergence establishing corresponding internal entities sequentially.
     * 
     * @param {AuthRequest} req - Incorporates normalized structures inherited from federated SSO ecosystems.
     * @param {Response} res - Emits HTTP redirect directives redirecting flows towards centralized UI gateways.
     * @param {NextFunction} next - Eventual consistency validation and issue fallback conduit.
     */
    async oauthCallback(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await authService.handleOAuthUser(req.user!);

            const params = new URLSearchParams({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });

            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?${params}`);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Initializes unauthenticated identity restoration protocols broadcasting time-limited cryptographic emails 
     * utilizing robust obfuscation logic to counteract surface enumeration operations.
     * 
     * @param {AuthRequest} req - Delivers targeting email addresses initiating procedural communication graphs.
     * @param {Response} res - Ensures homogeneous resolution payloads masking underlying topological truths.
     * @param {NextFunction} next - Catch-all error delegator interface.
     */
    async forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await authService.requestPasswordReset(req.body.email);
            res.json({
                success: true,
                message: 'If an account with that email exists, a reset link has been sent.',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ingests out-of-band temporary keys finalizing authorization and appending modified hashing strings into cold storage.
     * 
     * @param {AuthRequest} req - Transport incorporating synchronized restoration token and resultant credentials.
     * @param {Response} res - Affirms structural synchronization prompting behavioral transitions across interface realms.
     * @param {NextFunction} next - Traversal instruction node escalating programmatic faults.
     */
    async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;
            await authService.resetPassword(token, newPassword);
            res.json({
                success: true,
                message: 'Password reset successfully. Please log in with your new password.',
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
