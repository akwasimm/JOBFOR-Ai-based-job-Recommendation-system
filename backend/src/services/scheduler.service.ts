import cron from 'node-cron';
import axios from 'axios';
import { prisma } from '@/config/database';
import { env } from '@/config/env';

// ─── Skill extractor ─────────────────────────────────────────────
const KNOWN_SKILLS = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby',
    'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB',
    'React', 'Angular', 'Vue.js', 'Next.js', 'Svelte', 'Nuxt.js',
    'Node.js', 'Express', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI',
    'Spring Boot', 'Laravel', 'Rails', 'ASP.NET',
    'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'Git', 'CI/CD', 'Jenkins', 'GitHub Actions',
    'REST', 'GraphQL', 'gRPC', 'WebSocket',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
    'Figma', 'Sketch', 'Adobe XD',
    'Agile', 'Scrum', 'Kanban', 'JIRA',
    'Linux', 'Nginx', 'Apache', 'Webpack', 'Vite',
    'Redux', 'Zustand', 'MobX', 'Prisma', 'Sequelize',
    'Jest', 'Cypress', 'Playwright', 'Selenium',
    'Firebase', 'Supabase', 'Vercel', 'Netlify',
    'Microservices', 'Serverless', 'Event-Driven',
];

function extractSkills(text: string): string[] {
    const lower = text.toLowerCase();
    return KNOWN_SKILLS.filter(s => lower.includes(s.toLowerCase()));
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Upsert into DB ──────────────────────────────────────────────
async function upsertJob(job: any): Promise<boolean> {
    if (!job.externalId || !job.title || !job.applyUrl) return false;
    try {
        await prisma.jobsCache.upsert({
            where: { externalId: job.externalId },
            create: job,
            update: {
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                isRemote: job.isRemote,
                skills: job.skills,
                applyUrl: job.applyUrl,
                postedAt: job.postedAt,
                updatedAt: new Date(),
            },
        });
        return true;
    } catch {
        return false;
    }
}

// ─── Adzuna sync ─────────────────────────────────────────────────
async function syncAdzuna(): Promise<number> {
    if (!env.ADZUNA_APP_ID || !env.ADZUNA_APP_KEY) {
        console.log('⚠️  [Scheduler] Adzuna keys not set — skipping');
        return 0;
    }

    const queries = [
        { query: 'software engineer', location: '', pages: 3 },
        { query: 'frontend developer', location: '', pages: 2 },
        { query: 'backend developer', location: '', pages: 2 },
        { query: 'react developer', location: '', pages: 2 },
        { query: 'python developer', location: '', pages: 2 },
        { query: 'full stack developer', location: '', pages: 2 },
        { query: 'machine learning', location: '', pages: 1 },
        { query: 'devops engineer', location: '', pages: 1 },
        { query: 'software developer', location: 'bangalore', pages: 2 },
        { query: 'software developer', location: 'hyderabad', pages: 1 },
        { query: 'remote developer', location: '', pages: 1 },
    ];

    let total = 0;

    for (const { query, location, pages } of queries) {
        for (let page = 1; page <= pages; page++) {
            try {
                const res = await axios.get(
                    `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
                    {
                        params: {
                            app_id: env.ADZUNA_APP_ID,
                            app_key: env.ADZUNA_APP_KEY,
                            what: query,
                            where: location || '',
                            results_per_page: 50,
                            sort_by: 'date',
                        },
                        timeout: 15000,
                    }
                );

                const jobs = (res.data?.results || []).map((j: any) => ({
                    externalId: `adzuna_${j.id}`,
                    source: 'adzuna',
                    title: j.title || '',
                    company: j.company?.display_name || 'Unknown',
                    companyLogo: null,
                    location: j.location?.display_name || '',
                    description: j.description || '',
                    salaryMin: j.salary_min ? Math.round(j.salary_min) : null,
                    salaryMax: j.salary_max ? Math.round(j.salary_max) : null,
                    currency: 'INR',
                    isRemote: (j.title + ' ' + j.description).toLowerCase().includes('remote'),
                    skills: extractSkills(j.description || ''),
                    applyUrl: j.redirect_url || '',
                    postedAt: j.created ? new Date(j.created) : null,
                    expiresAt: null,
                    rawData: j,
                }));

                for (const job of jobs) {
                    if (await upsertJob(job)) total++;
                }
            } catch (e: any) {
                console.warn(`⚠️  [Scheduler] Adzuna error (${query} p${page}): ${e.message}`);
            }
            await sleep(400);
        }
    }

    return total;
}

// ─── JSearch sync ────────────────────────────────────────────────
async function syncJSearch(): Promise<number> {
    if (!env.JSEARCH_API_KEY) {
        console.log('⚠️  [Scheduler] JSearch key not set — skipping');
        return 0;
    }

    // Conservative — 17 calls total (free tier = 200/month)
    const queries = [
        { query: 'software engineer india', pages: 2 },
        { query: 'react developer india', pages: 1 },
        { query: 'python developer india', pages: 1 },
        { query: 'full stack developer india', pages: 1 },
        { query: 'devops engineer india', pages: 1 },
        { query: 'data engineer india', pages: 1 },
        { query: 'machine learning india', pages: 1 },
        { query: 'frontend developer india', pages: 1 },
        { query: 'ui ux designer india', pages: 1 },
    ];

    let total = 0;

    for (const { query, pages } of queries) {
        for (let page = 1; page <= pages; page++) {
            try {
                const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
                    params: { query, page: page.toString(), num_pages: '1', date_posted: 'all', country: 'in' },
                    headers: {
                        'x-rapidapi-key': env.JSEARCH_API_KEY,
                        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
                    },
                    timeout: 30000,
                });

                const jobs = (res.data?.data || []).map((j: any) => ({
                    externalId: `jsearch_${j.job_id}`,
                    source: 'jsearch',
                    title: j.job_title || '',
                    company: j.employer_name || 'Unknown',
                    companyLogo: j.employer_logo || null,
                    location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', '),
                    description: j.job_description || '',
                    salaryMin: j.job_min_salary ? Math.round(j.job_min_salary) : null,
                    salaryMax: j.job_max_salary ? Math.round(j.job_max_salary) : null,
                    currency: j.job_salary_currency || 'USD',
                    isRemote: j.job_is_remote || false,
                    skills: extractSkills(j.job_description || ''),
                    applyUrl: j.job_apply_link || '',
                    postedAt: j.job_posted_at_datetime_utc ? new Date(j.job_posted_at_datetime_utc) : null,
                    expiresAt: j.job_offer_expiration_datetime_utc ? new Date(j.job_offer_expiration_datetime_utc) : null,
                    rawData: j,
                }));

                for (const job of jobs) {
                    if (await upsertJob(job)) total++;
                }
            } catch (e: any) {
                console.warn(`⚠️  [Scheduler] JSearch error (${query} p${page}): ${e.message}`);
            }
            await sleep(500);
        }
    }

    return total;
}

// ─── Full sync runner ─────────────────────────────────────────────
async function runFullSync(source: 'adzuna' | 'jsearch' | 'all' = 'all') {
    const label = `[Scheduler][${source.toUpperCase()}]`;
    console.log(`\n🔄 ${label} Starting automatic job sync...`);
    const start = Date.now();

    let adzunaSaved = 0;
    let jsearchSaved = 0;

    if (source === 'adzuna' || source === 'all') {
        console.log(`📡 ${label} Syncing Adzuna...`);
        adzunaSaved = await syncAdzuna();
        console.log(`✅ ${label} Adzuna: ${adzunaSaved} jobs saved`);
    }

    if (source === 'jsearch' || source === 'all') {
        console.log(`📡 ${label} Syncing JSearch...`);
        jsearchSaved = await syncJSearch();
        console.log(`✅ ${label} JSearch: ${jsearchSaved} jobs saved`);
    }

    const total = await prisma.jobsCache.count();
    const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);
    console.log(`\n🎉 ${label} Sync done in ${elapsed}m — ${adzunaSaved + jsearchSaved} new jobs | Total in DB: ${total}\n`);
}

// ─── Schedule setup ──────────────────────────────────────────────
export function startScheduler() {
    console.log('⏰ [Scheduler] Job sync scheduler started');

    // ── Adzuna: every Sunday at 2:00 AM
    // Cron: '0 2 * * 0' → At 02:00 on Sunday
    cron.schedule('0 2 * * 0', async () => {
        await runFullSync('adzuna');
    }, { timezone: 'Asia/Kolkata' });

    // ── JSearch: 1st of every month at 3:00 AM (~10 calls/run, safe for 200/month limit)
    // Cron: '0 3 1 * *' → At 03:00 on day 1 of every month
    cron.schedule('0 3 1 * *', async () => {
        await runFullSync('jsearch');
    }, { timezone: 'Asia/Kolkata' });

    console.log('📅 [Scheduler] Schedules:');
    console.log('   • Adzuna  → Every Sunday at 2:00 AM IST');
    console.log('   • JSearch → 1st of every month at 3:00 AM IST');
    console.log('   • (manual override: npm run jobs:sync --workspace=backend)\n');

    // ── Run an initial Adzuna sync 30 seconds after server starts
    //    (only if DB has fewer than 100 jobs — i.e. fresh install)
    setTimeout(async () => {
        try {
            const count = await prisma.jobsCache.count();
            if (count < 100) {
                console.log(`ℹ️  [Scheduler] DB has only ${count} jobs. Running initial sync...`);
                await runFullSync('all');
            } else {
                console.log(`ℹ️  [Scheduler] DB has ${count} jobs — skipping initial sync ✅`);
            }
        } catch (e: any) {
            console.warn('⚠️  [Scheduler] Initial sync check failed:', e.message);
        }
    }, 30_000); // 30 seconds after start
}
