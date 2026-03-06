import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { env } from './env';
import { prisma } from './database';

export function configurePassport(): void {
    // ─── Google OAuth ──────────────────────────────────
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: env.GOOGLE_CLIENT_ID,
                    clientSecret: env.GOOGLE_CLIENT_SECRET,
                    callbackURL: env.GOOGLE_CALLBACK_URL,
                    scope: ['profile', 'email'],
                },
                async (_accessToken, _refreshToken, profile, done) => {
                    try {
                        const email = profile.emails?.[0]?.value;
                        if (!email) return done(new Error('No email from Google'), undefined);

                        let user = await prisma.user.findFirst({
                            where: { authProvider: 'GOOGLE', providerId: profile.id },
                        });

                        if (!user) {
                            user = await prisma.user.findUnique({ where: { email } });

                            if (user) {
                                // Link existing account
                                user = await prisma.user.update({
                                    where: { id: user.id },
                                    data: { authProvider: 'GOOGLE', providerId: profile.id, isEmailVerified: true },
                                });
                            } else {
                                // Create new user
                                user = await prisma.user.create({
                                    data: {
                                        email,
                                        authProvider: 'GOOGLE',
                                        providerId: profile.id,
                                        isEmailVerified: true,
                                        profile: {
                                            create: {
                                                firstName: profile.name?.givenName || '',
                                                lastName: profile.name?.familyName || '',
                                                avatarUrl: profile.photos?.[0]?.value || null,
                                            },
                                        },
                                    },
                                });
                            }
                        }

                        return done(null, user);
                    } catch (error) {
                        return done(error as Error, undefined);
                    }
                }
            )
        );
    }

    // ─── GitHub OAuth ──────────────────────────────────
    if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
        passport.use(
            new GitHubStrategy(
                {
                    clientID: env.GITHUB_CLIENT_ID,
                    clientSecret: env.GITHUB_CLIENT_SECRET,
                    callbackURL: env.GITHUB_CALLBACK_URL,
                    scope: ['user:email'],
                },
                async (
                    _accessToken: string,
                    _refreshToken: string,
                    profile: any,
                    done: (error: Error | null, user?: any) => void
                ) => {
                    try {
                        const email = profile.emails?.[0]?.value;
                        if (!email) return done(new Error('No email from GitHub'));

                        let user = await prisma.user.findFirst({
                            where: { authProvider: 'GITHUB', providerId: profile.id },
                        });

                        if (!user) {
                            user = await prisma.user.findUnique({ where: { email } });

                            if (user) {
                                user = await prisma.user.update({
                                    where: { id: user.id },
                                    data: { authProvider: 'GITHUB', providerId: profile.id, isEmailVerified: true },
                                });
                            } else {
                                user = await prisma.user.create({
                                    data: {
                                        email,
                                        authProvider: 'GITHUB',
                                        providerId: profile.id,
                                        isEmailVerified: true,
                                        profile: {
                                            create: {
                                                firstName: profile.displayName?.split(' ')[0] || '',
                                                lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
                                                avatarUrl: profile.photos?.[0]?.value || null,
                                                githubUrl: profile.profileUrl || null,
                                            },
                                        },
                                    },
                                });
                            }
                        }

                        return done(null, user);
                    } catch (error) {
                        return done(error as Error);
                    }
                }
            )
        );
    }

    // ─── Serialization ────────────────────────────────
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { id } });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}
