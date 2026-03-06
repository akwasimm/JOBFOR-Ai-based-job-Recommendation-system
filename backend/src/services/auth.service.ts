import { prisma } from '@/config/database';
import { hashPassword, comparePasswords } from '@/utils/password';
import { generateTokenPair, verifyToken } from '@/utils/jwt';
import { AppError } from '@/utils/helpers';
import { emailService } from './email.service';
import { User } from '@prisma/client';
import crypto from 'crypto';
import { cacheService } from './cache.service';

interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginInput {
    email: string;
    password: string;
}

/**
 * Enterprise service coordinating cryptographic identity verification, secure token lifecycle management,
 * and principal validation mechanisms strictly enforcing system perimeter security bounds.
 * 
 * @class AuthService
 */
export class AuthService {
    /**
     * Instantiates unique user entity identifiers appending robust BCrypt hashed credentials to localized persistence layers.
     * Subsequently fires asynchronous telemetry confirming entity creation metrics without blocking I/O throughput.
     * 
     * @param {RegisterInput} input - Contains unencrypted foundational properties required for entity generation.
     * @returns {Promise<any>} Resolves structural confirmation incorporating signed JWT objects alongside sanitized entity parameters.
     * @throws {AppError} Elevates HTTP 409 conflict states terminating creation pipelines upon duplicate email discovery.
     */
    async register(input: RegisterInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw new AppError('An account with this email already exists.', 409);
        }

        const passwordHash = await hashPassword(input.password);

        const user = await prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                profile: {
                    create: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                    },
                },
            },
            include: {
                profile: true,
            },
        });

        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken },
        });

        const verifyToken = crypto.randomBytes(32).toString('hex');
        emailService.sendVerificationEmail(user.email, verifyToken).catch(() => { });

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    /**
     * Executes stringent password comparative evaluation sequences assessing input hashes against stored cryptographic signatures.
     * Generates rotational symmetric keys (JWTs) empowering protracted stateless API interaction.
     * 
     * @param {LoginInput} input - Extracts localized credentials asserting identity claims.
     * @returns {Promise<any>} Relays dual-token architecture sets confirming programmatic traversal permissions.
     * @throws {AppError} Enacts a 401 HTTP denial preventing structural breaches upon comparative mismatch.
     */
    async login(input: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: input.email },
            include: { profile: true },
        });

        if (!user || !user.passwordHash) {
            throw new AppError('Invalid email or password.', 401);
        }

        const isPasswordValid = await comparePasswords(input.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password.', 401);
        }

        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: tokens.refreshToken,
                lastLoginAt: new Date(),
            },
        });

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    /**
     * Validates offline persistence tokens re-evaluating identity mapping integrity to issue non-interactive session replacements.
     * Continually overwrites active refresh mappings neutralizing stale keys preventing session replay attacks.
     * 
     * @param {string} refreshToken - Lengthy cryptographic string granting indirect authorization capabilities.
     * @returns {Promise<any>} Establishes newly signed ephemeral JWTs mapping refreshed access dimensions.
     * @throws {AppError} Dispatches 401 validation failures obstructing unauthorized or expired key consumption.
     */
    async refreshToken(refreshToken: string) {
        try {
            const decoded = verifyToken(refreshToken);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { profile: true },
            });

            if (!user || user.refreshToken !== refreshToken) {
                throw new AppError('Invalid refresh token.', 401);
            }

            const tokens = generateTokenPair({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken: tokens.refreshToken },
            });

            return {
                user: this.sanitizeUser(user),
                ...tokens,
            };
        } catch {
            throw new AppError('Invalid or expired refresh token.', 401);
        }
    }

    /**
     * Nullifies established validation mappings destroying background capability tokens terminating authenticated sessions absolute.
     * 
     * @param {number} userId - Authenticated principal targeting destructive key nullification scripts.
     * @returns {Promise<void>} Reflects completion status ending synchronized continuity.
     */
    async logout(userId: number) {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }

    /**
     * Deploys out-of-band communication graphs instigating asynchronous recovery channels bridging forgotten credentials.
     * Leverages robust digest algorithms generating time-sensitive temporary verification endpoints.
     * 
     * @param {string} email - Deterministic indicator addressing forgotten tenant profile mappings.
     * @returns {Promise<void>} Completes silently avoiding structural enumeration attack surfaces.
     */
    async requestPasswordReset(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.authProvider !== 'EMAIL') return;

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: tokenHash, resetTokenExpiresAt: expiresAt },
        });

        await emailService.sendPasswordResetEmail(email, rawToken);
    }

    /**
     * Finalizes recovery sequence validating external tokens against hashed counterparts thereby injecting new credential assertions.
     * Incurs session termination policies mandating full re-authentication confirming ownership transfer properties.
     * 
     * @param {string} rawToken - Temporary cryptographic key embedded inside outbound communications.
     * @param {string} newPassword - Selected replacement payload targeting subsequent login schemas.
     * @returns {Promise<void>} Resets persistence stores confirming absolute password state modification.
     * @throws {AppError} Elevates HTTP 400 fault mitigating expired or structurally invalid recovery processes.
     */
    async resetPassword(rawToken: string, newPassword: string) {
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetToken: tokenHash,
                resetTokenExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            throw new AppError('Invalid or expired reset token.', 400);
        }

        const passwordHash = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiresAt: null,
                refreshToken: null,
            },
        });
    }

    /**
     * Establishes identity synchronization merging SSO proxy arrays utilizing external provider guarantees.
     * Generates internal programmatic access sets extending federated capabilities.
     * 
     * @param {User} user - Decoupled data object translating properties from federated identity hosts.
     * @returns {Promise<any>} Relays functional identity sets facilitating front-end redirection protocols.
     */
    async handleOAuthUser(user: User) {
        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: tokens.refreshToken,
                lastLoginAt: new Date(),
            },
        });

        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { profile: true },
        });

        return {
            user: this.sanitizeUser(fullUser!),
            ...tokens,
        };
    }

    /**
     * Extracts and maps exhaustive topographical parameters defining explicit user capability schemas and histories.
     * Utilizes intelligent underlying caching hierarchies reducing redundant database overhead constraints.
     * 
     * @param {number} userId - Identifies requested contextual blocks spanning disparate interrelated domains.
     * @returns {Promise<Partial<User>>} Emits completely populated localized profiles minus obfuscated fields.
     * @throws {AppError} Generates a 404 fault if no corresponding relational structure can be validated.
     */
    async getCurrentUser(userId: number) {
        const cacheKey = `user:${userId}:me`;
        const user = await cacheService.getOrSet(cacheKey, async () => {
            return prisma.user.findUnique({
                where: { id: userId },
                include: {
                    profile: {
                        include: {
                            skills: { include: { skill: true } },
                            workExperience: { orderBy: { startDate: 'desc' } },
                            education: { orderBy: { startDate: 'desc' } },
                            certifications: true,
                        },
                    },
                },
            });
        }, 300);

        if (!user) throw new AppError('User not found.', 404);
        return this.sanitizeUser(user);
    }

    /**
     * Performs static reduction operations obliterating highly sensitive storage properties averting accidental leakages.
     * 
     * @param {any} user - Raw target schema structure imported directly from persistence levels.
     * @returns {Partial<User>} Obfuscated JSON array completely restricting visibility of core identity mechanisms.
     */
    private sanitizeUser(user: any) {
        const { passwordHash, refreshToken, ...sanitized } = user;
        return sanitized;
    }
}

export const authService = new AuthService();
