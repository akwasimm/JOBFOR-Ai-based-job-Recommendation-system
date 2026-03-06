import rateLimit from 'express-rate-limit';

/**
 * Enacts global trajectory capping mitigating wide-net volumetric attacks targeting open endpoints natively managing 100 interaction limits against isolated sliding 15-minute intervals structurally.
 * @constant apiLimiter
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Hardens authentication ingress points resolving rapid brute-forcing trajectories heavily penalizing volumetric identification querying restricting distinct target pools strictly natively.
 * @constant authLimiter
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Mitigates costly inferential computational boundaries capturing sustained repetitive inference logic requests heavily isolating long 60-minute duration intervals against tight 20 operation subsets definitively.
 * @constant aiLimiter
 */
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error: 'AI rate limit exceeded. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
