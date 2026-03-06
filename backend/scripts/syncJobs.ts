import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || '';
const JSEARCH_KEY = process.env.JSEARCH_API_KEY || '';
const DELAY_MS = 400;

/**
 * Conducts communication sequences across external NLP gateways to distill competency profiles from descriptive corpora.
 * 
 * @param {string} text - The constituent block of unstructured text to be analyzed.
 * @returns {Promise<string[]>} Resolves yielding arrays encapsulating extracted expertise lexicons.
 */
async function extractSkillsViaML(text: string): Promise<string[]> {
    if (!text || text.trim() === '') return [];
    try {
        const res = await axios.post('http://localhost:8000/extract-skills', { text });
        return res.data?.skills || [];
    } catch (err) {
        return [];
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Commits sequential transaction aggregations into primary persistence datastores acting as an ETL sink.
 * 
 * @param {any[]} jobs - Iterables representing standardized job object schemas.
 * @returns {Promise<{ saved: number; skipped: number }>} Quantified audit telemetry capturing ingestion status.
 */
async function upsertBatch(jobs: any[]): Promise<{ saved: number; skipped: number }> {
    let saved = 0, skipped = 0;
    for (const job of jobs) {
        if (!job.externalId || !job.title || !job.applyUrl) { skipped++; continue; }
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
            saved++;
        } catch { skipped++; }
    }
    return { saved, skipped };
}

/**
 * Transforms schema representations emitted by alternative job boards to converge with internal platform ontologies.
 * 
 * @param {any} job - Structural dictionary of elements yielded by downstream API operations.
 * @returns {Promise<any>} An intrinsically uniform semantic hierarchy acceptable within enterprise caching architecture.
 */
async function normalizeAdzuna(job: any) {
    const skills = await extractSkillsViaML(job.description || '');
    return {
        externalId: `adzuna_${job.id}`,
        source: 'adzuna',
        title: job.title || '',
        company: job.company?.display_name || 'Unknown',
        companyLogo: null as string | null,
        location: job.location?.display_name || '',
        description: job.description || '',
        salaryMin: job.salary_min ? Math.round(job.salary_min) : null,
        salaryMax: job.salary_max ? Math.round(job.salary_max) : null,
        currency: 'INR',
        isRemote: (job.title + ' ' + job.description).toLowerCase().includes('remote'),
        skills: skills,
        applyUrl: job.redirect_url || '',
        postedAt: job.created ? new Date(job.created) : null,
        expiresAt: null as Date | null,
        rawData: job as any,
    };
}

/**
 * Originates outbound TCP streams querying remote recruitment syndicators for segmented page data.
 * 
 * @param {string} query - The specific search heuristic directing downstream behavior.
 * @param {string} location - Delimiting geospatial boundary parameter augmenting search specificity.
 * @param {number} page - Sub-index pointer designating paginated offsets.
 * @returns {Promise<any[]>} Extracted and deserialized payload payload structures.
 */
async function fetchAdzunaPage(query: string, location: string, page: number): Promise<any[]> {
    const res = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
        {
            params: {
                app_id: ADZUNA_APP_ID,
                app_key: ADZUNA_APP_KEY,
                what: query,
                where: location || '',
                results_per_page: 50,
                sort_by: 'date',
            },
            timeout: 15000,
        }
    );
    return res.data?.results || [];
}

/**
 * Modulates continuous iteration frameworks to repeatedly capture extensive listings matching arbitrary characteristics.
 * 
 * @param {string} query - Root entity to be translated as the categorical search criteria.
 * @param {string} location - Ancillary filter targeting defined topological geographies.
 * @param {number} pages - Pre-established threshold mapping the iteration recursion limits.
 * @returns {Promise<number>} An aggregated numeric output confirming the successfully mapped entries.
 */
async function syncAdzunaQuery(query: string, location: string, pages: number): Promise<number> {
    let total = 0;
    for (let page = 1; page <= pages; page++) {
        try {
            const raw = await fetchAdzunaPage(query, location, page);
            if (!raw.length) { break; }

            const normalized = [];
            for (const r of raw) {
                normalized.push(await normalizeAdzuna(r));
            }

            const { saved } = await upsertBatch(normalized);
            total += saved;
        } catch (e: any) { }
        if (page < pages) await sleep(DELAY_MS);
    }
    return total;
}

/**
 * Transforms idiosyncratic object mappings generated via secondary API providers into coherent unified architectures.
 * 
 * @param {any} job - Distal payload instance encapsulating unique taxonomy attributes.
 * @returns {Promise<any>} Synthesized target definition prepared for subsequent repository processing.
 */
async function normalizeJSearch(job: any) {
    const location = [job.job_city, job.job_state, job.job_country]
        .filter(Boolean).join(', ');

    const skills = await extractSkillsViaML(job.job_description || '');

    return {
        externalId: `jsearch_${job.job_id}`,
        source: 'jsearch',
        title: job.job_title || '',
        company: job.employer_name || 'Unknown',
        companyLogo: job.employer_logo || null,
        location,
        description: job.job_description || '',
        salaryMin: job.job_min_salary ? Math.round(job.job_min_salary) : null,
        salaryMax: job.job_max_salary ? Math.round(job.job_max_salary) : null,
        currency: job.job_salary_currency || 'USD',
        isRemote: job.job_is_remote || false,
        skills: skills,
        applyUrl: job.job_apply_link || '',
        postedAt: job.job_posted_at_datetime_utc
            ? new Date(job.job_posted_at_datetime_utc) : null,
        expiresAt: job.job_offer_expiration_datetime_utc
            ? new Date(job.job_offer_expiration_datetime_utc) : null,
        rawData: job as any,
    };
}

/**
 * Instructs RapidAPI gateway routing nodes to traverse indexed data warehouses for specific token alignments.
 * 
 * @param {string} query - Substantive context element specifying domain preferences.
 * @param {number} page - Zero-indexed pointer coordinating the pagination flow traversal.
 * @returns {Promise<any[]>} Arrays encapsulating the upstream parsed node results.
 */
async function fetchJSearchPage(query: string, page: number): Promise<any[]> {
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: {
            query,
            page: page.toString(),
            num_pages: '1',
            date_posted: 'all',
            country: 'in',
        },
        headers: {
            'x-rapidapi-key': JSEARCH_KEY,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
        timeout: 30000,
    });
    return res.data?.data || [];
}

/**
 * Superintends execution phases sequentially targeting third-party data access strategies for defined keyword batches.
 * 
 * @param {string} query - Top-level conceptual anchor enforcing classification limits.
 * @param {number} pages - Max cycle constant limiting continuous page consumption behaviors.
 * @returns {Promise<number>} Emits sum-total validation statistics defining integrated job figures.
 */
async function syncJSearchQuery(query: string, pages: number): Promise<number> {
    let total = 0;
    for (let page = 1; page <= pages; page++) {
        try {
            const raw = await fetchJSearchPage(query, page);
            if (!raw.length) { break; }

            const normalized = [];
            for (const r of raw) {
                normalized.push(await normalizeJSearch(r));
            }

            const { saved } = await upsertBatch(normalized);
            total += saved;
        } catch (e: any) { }
        if (page < pages) await sleep(DELAY_MS);
    }
    return total;
}

const ADZUNA_PLAN = [
    { query: 'software engineer', location: '', pages: 5 },
    { query: 'frontend developer', location: '', pages: 3 },
    { query: 'backend developer', location: '', pages: 3 },
    { query: 'full stack developer', location: '', pages: 3 },
    { query: 'react developer', location: '', pages: 3 },
    { query: 'node.js developer', location: '', pages: 2 },
    { query: 'python developer', location: '', pages: 3 },
    { query: 'machine learning engineer', location: '', pages: 2 },
    { query: 'data engineer', location: '', pages: 2 },
    { query: 'devops engineer', location: '', pages: 2 },
    { query: 'product designer', location: '', pages: 2 },
    { query: 'ui ux designer', location: '', pages: 2 },
    { query: 'software developer', location: 'bangalore', pages: 3 },
    { query: 'software developer', location: 'mumbai', pages: 2 },
    { query: 'software developer', location: 'hyderabad', pages: 2 },
    { query: 'software developer', location: 'pune', pages: 2 },
    { query: 'remote software engineer', location: '', pages: 3 },
];

const JSEARCH_PLAN = [
    { query: 'software engineer india', pages: 3 },
    { query: 'react developer india', pages: 2 },
    { query: 'python developer india', pages: 2 },
    { query: 'full stack developer india', pages: 2 },
    { query: 'machine learning india', pages: 2 },
    { query: 'devops engineer india', pages: 1 },
    { query: 'data engineer india', pages: 1 },
    { query: 'node developer india', pages: 1 },
    { query: 'frontend developer india', pages: 2 },
    { query: 'ui ux designer india', pages: 1 },
];

/**
 * Top-level application manifest initiating scheduled invocation of synchronized external API scraping processes.
 * Orchestrates configuration bindings and routes operational paths predicated on script parameters.
 */
async function main() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'all';

    if ((mode === 'all' || mode === 'adzuna') && ADZUNA_APP_ID && ADZUNA_APP_KEY) {
        let plan = ADZUNA_PLAN;

        if (mode === 'adzuna' && args[1]) {
            plan = [{ query: args[1], location: args[2] || '', pages: parseInt(args[3] || '3', 10) }];
        }

        for (const { query, location, pages } of plan) {
            await syncAdzunaQuery(query, location, pages);
        }
    }

    if ((mode === 'all' || mode === 'jsearch') && JSEARCH_KEY) {
        let plan = JSEARCH_PLAN;

        if (mode === 'jsearch' && args[1]) {
            plan = [{ query: args[1], pages: parseInt(args[2] || '3', 10) }];
        }

        for (const { query, pages } of plan) {
            await syncJSearchQuery(query, pages);
        }
    }

}

main()
    .catch(e => { process.exit(1); })
    .finally(() => prisma.$disconnect());
