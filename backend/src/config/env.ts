import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3001),
    FRONTEND_URL: z.string().default('http://localhost:3000'),

    DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/jobsearch'),

    REDIS_URL: z.string().default('redis://localhost:6379'),

    JWT_SECRET: z.string().default('dev-secret-change-in-production-min-32-chars!!'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

    GOOGLE_CLIENT_ID: z.string().default(''),
    GOOGLE_CLIENT_SECRET: z.string().default(''),
    GOOGLE_CALLBACK_URL: z.string().default('http://localhost:3001/api/auth/google/callback'),

    LINKEDIN_CLIENT_ID: z.string().default(''),
    LINKEDIN_CLIENT_SECRET: z.string().default(''),
    LINKEDIN_CALLBACK_URL: z.string().default('http://localhost:3001/api/auth/linkedin/callback'),

    GITHUB_CLIENT_ID: z.string().default(''),
    GITHUB_CLIENT_SECRET: z.string().default(''),
    GITHUB_CALLBACK_URL: z.string().default('http://localhost:3001/api/auth/github/callback'),

    ADZUNA_APP_ID: z.string().default(''),
    ADZUNA_APP_KEY: z.string().default(''),
    JSEARCH_API_KEY: z.string().default(''),

    OPENAI_API_KEY: z.string().default(''),

    CLOUDINARY_CLOUD_NAME: z.string().default(''),
    CLOUDINARY_API_KEY: z.string().default(''),
    CLOUDINARY_API_SECRET: z.string().default(''),

    SMTP_HOST: z.string().default('smtp.gmail.com'),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().default(''),
    SMTP_PASS: z.string().default(''),
    EMAIL_FROM: z.string().default('noreply@jobsearchassistant.com'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
