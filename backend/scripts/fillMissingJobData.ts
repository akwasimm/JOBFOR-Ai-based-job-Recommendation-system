import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load the environment variables to access the OpenAI API key and Database URL
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Utility function to sleep and prevent rate-limiting
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('🤖 Starting AI Job Data Backfiller...');

    // Fetch jobs that are missing BOTH salary fields.
    const jobsToProcess = await prisma.jobsCache.findMany({
        where: {
            OR: [
                { salaryMin: null },
                { salaryMax: null },
            ]
        },
        take: 50, // Process in batches so we don't overwhelm the API
    });

    console.log(`🔍 Found ${jobsToProcess.length} jobs missing salary data.`);

    if (jobsToProcess.length === 0) {
        console.log('✅ No jobs missing data at this time. Exiting.');
        return;
    }

    let updatedCount = 0;
    let failedCount = 0;

    for (const job of jobsToProcess) {
        console.log(`\nAnalyzing Job: [${job.externalId}] ${job.title} at ${job.company}`);

        try {
            // Give ChatGPT the context of the job to try and find or estimate the salary
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert HR data parser. Your task is to extract or intelligently estimate the expected ANNUAL salary for a given job. 
                        
RULES: 
1. Provide the response as pure JSON matching this exact structure: {"salaryMin": Number, "salaryMax": Number, "currency": "INR" | "USD"}.
2. Even if the job description doesn't explicitly state the salary, you MUST estimate a reasonable market rate based on the job title, company, and location.
3. If the location is in India or the job is remote but aimed at India, use INR metrics (e.g., 500000 for 5 LPA).
4. If it's a US or global remote role, use USD metrics (e.g., 90000 for $90k).
5. Ensure the numbers are integers (raw numbers, no commas, no text). Do not output markdown codeblocks, output just the raw JSON object string.`
                    },
                    {
                        role: 'user',
                        content: `Job Title: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\n\nDescription Snippet: ${job.description.substring(0, 1500)}`
                    }
                ],
                temperature: 0.3, // Lower temperature for more deterministic/factual output
                max_tokens: 100,
            });

            const content = response.choices[0]?.message?.content?.trim() || '{}';

            // Clean up backticks in case the AI accidentally returned markdown formatting
            const cleanJsonString = content.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJsonString);

            if (parsed.salaryMin && parsed.salaryMax) {

                await prisma.jobsCache.update({
                    where: { id: job.id },
                    data: {
                        salaryMin: parsed.salaryMin,
                        salaryMax: parsed.salaryMax,
                        currency: parsed.currency || 'INR',
                    }
                });

                console.log(`   ✅ Extracted/Estimated Salary: ${parsed.salaryMin} - ${parsed.salaryMax} ${parsed.currency}`);
                updatedCount++;
            } else {
                console.log(`   ⚠️ AI could not establish a confident integer range. Skipping.`);
                failedCount++;
            }

            // Sleep for 1 second to respect API rate limits
            await delay(1000);

        } catch (err: any) {
            console.error(`   ❌ Failed to process job ${job.id}: ${err.message}`);
            failedCount++;
        }
    }

    console.log(`\n🎉 Backfill Complete!`);
    console.log(`📊 Successfully updated: ${updatedCount}`);
    console.log(`⚠️ Failed or skipped: ${failedCount}`);
}

main()
    .catch((e) => {
        console.error('Fatal error running backfiller:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
