import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import fs from 'fs';

import { env } from './config/env';
import { prisma } from './config/database';
import { configurePassport } from './config/passport';
import { apiLimiter, errorHandler, notFoundHandler } from './middleware';
import routes from './routes';
import { startScheduler } from './services/scheduler.service';

// ─── Create Express App ─────────────────────────────────
const app = express();

// ─── Security Middleware ────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Rate Limiting ──────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Passport OAuth ─────────────────────────────────────
configurePassport();
app.use(passport.initialize());

// ─── Static Files (Uploads) ────────────────────────────
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ─── Health Check ───────────────────────────────────────
app.get('/api/health', async (_req, res) => {
    try {
        // Verify DB connection
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: env.NODE_ENV,
            version: '1.0.0',
            services: {
                database: 'connected',
                server: 'running',
            },
        });
    } catch {
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            services: {
                database: 'disconnected',
                server: 'running',
            },
        });
    }
});

// ─── API Routes ─────────────────────────────────────────
app.use('/api', routes);

// ─── Error Handling ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────
const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🚀 Job Search Assistant API                    ║
║                                                  ║
║   Server: http://localhost:${PORT}             ║
║   Environment: ${env.NODE_ENV.padEnd(26)}    ║
║   API Base: http://localhost:${PORT}/api         ║
║   Health: http://localhost:${PORT}/api/health  ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);

    // ─── Start background job sync scheduler ────────────
    startScheduler();
});

// ─── Graceful Shutdown ──────────────────────────────────
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received. Shutting down...');
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
