import OpenAI from 'openai';
import { env } from '@/config/env';
import { prisma } from '@/config/database';
import { ChatMessage, ResumeReviewResult } from '@/types';
import { AppError } from '@/utils/helpers';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service orchestrating complex generative AI interactions mediating career advisement,
 * document analysis, and conversational logic flow state retention via OpenAI endpoints.
 * 
 * @class AiCoachService
 */
export class AiCoachService {
    private openai: OpenAI | null = null;

    /**
     * Instantiates or retrieves singleton connection pools governing OpenAI REST topologies.
     * Guaranteed to return an authorized client socket enforcing environment constraints.
     * 
     * @returns {OpenAI} Dedicated connection client resolving language model interactions.
     * @throws {AppError} Emits fatal failure events if API configuration keys are absent.
     */
    private getClient(): OpenAI {
        if (!this.openai) {
            if (!env.OPENAI_API_KEY) {
                throw new AppError('OpenAI API key not configured', 500);
            }
            this.openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
        }
        return this.openai;
    }

    /**
     * Yields strictly delineated instruction matrices defining contextual persona constraints
     * aligning language model behavior with specific business domains.
     * 
     * @param {string} context - Thematic parameter signaling the desired narrative constraint dictionary.
     * @returns {string} Enumerable system prompt enforcing rigorous LLM behavior boundaries.
     */
    private getSystemPrompt(context: string): string {
        const prompts: Record<string, string> = {
            general: `You are an expert AI Career Coach specializing in helping job seekers. You provide personalized career advice, job search strategies, and professional development guidance. Be supportive, specific, and actionable in your responses. Use data-driven insights when possible.`,

            resume_review: `You are an expert resume reviewer and ATS optimization specialist. Analyze resumes for:
1. ATS compatibility and keyword optimization
2. Quantifiable achievements and impact statements
3. Professional formatting and structure
4. Relevance to target roles
5. Grammar and clarity
Provide a numerical score (0-100) and specific, actionable improvements.`,

            interview_prep: `You are an expert interview coach. Help candidates prepare for job interviews by:
1. Providing common interview questions for their role
2. Teaching the STAR method (Situation, Task, Action, Result)
3. Helping craft compelling answers
4. Conducting mock interview scenarios
5. Providing feedback on responses
Be encouraging but honest about areas for improvement.`,

            cover_letter: `You are an expert cover letter writer. Help create compelling, personalized cover letters that:
1. Address the specific job requirements
2. Highlight relevant experience and skills
3. Show genuine enthusiasm for the role and company
4. Maintain professional tone while being engaging
5. Keep it concise — ideally 3-4 paragraphs`,

            salary_negotiation: `You are an expert salary negotiation coach. Help candidates:
1. Research market rates for their role and location
2. Prepare counter-offer strategies
3. Practice negotiation scenarios
4. Understand total compensation packages
5. Build confidence in asking for fair compensation`,

            career_guidance: `You are a strategic career advisor. Help professionals with:
1. Career path planning and transitions
2. Skill development roadmaps
3. Industry trend analysis
4. Personal branding strategies
5. Long-term career goal setting`,
        };

        return prompts[context] || prompts.general;
    }

    /**
     * Conducts synchronous LLM evaluations interleaving historical context and explicit metadata arrays
     * generating coherent, stateful conversational continuations.
     * 
     * @param {number} userId - Identity anchor linking telemetry against originating users.
     * @param {string} message - Unstructured natural language input vector targeting generative models.
     * @param {string} [sessionId] - UUID token isolating conversational logic boundaries.
     * @param {string} [context='general'] - Functional classification controlling systemic instructions.
     * @returns {Promise<{ response: string; sessionId: string }>} Asynchronous resolution transmitting computed prose and continuity keys.
     */
    async chat(
        userId: number,
        message: string,
        sessionId?: string,
        context: string = 'general'
    ): Promise<{ response: string; sessionId: string }> {
        const client = this.getClient();
        const currentSessionId = sessionId || uuidv4();

        const history = await prisma.chatHistory.findMany({
            where: { userId, sessionId: currentSessionId },
            orderBy: { createdAt: 'asc' },
            take: 20,
        });

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                skills: { include: { skill: true } },
                workExperience: { orderBy: { startDate: 'desc' }, take: 3 },
            },
        });

        const profileContext = profile
            ? `\n\nUser Profile Context:
- Name: ${profile.firstName} ${profile.lastName}
- Current Role: ${profile.currentTitle || 'Not specified'} at ${profile.currentCompany || 'Not specified'}
- Experience: ${profile.experienceYears || 0} years
- Skills: ${(profile.skills || []).map((s: any) => s.skill.name).join(', ') || 'Not specified'}
- Latest Experience: ${profile.workExperience[0]?.title || 'Not specified'} at ${profile.workExperience[0]?.company || 'Not specified'}`
            : '';

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: this.getSystemPrompt(context) + profileContext },
            ...history.map((h: { role: string; content: string }) => ({
                role: h.role as 'user' | 'assistant',
                content: h.content,
            })),
            { role: 'user', content: message },
        ];

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            messages,
            max_tokens: 1500,
            temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

        await prisma.chatHistory.createMany({
            data: [
                { userId, sessionId: currentSessionId, role: 'user', content: message },
                { userId, sessionId: currentSessionId, role: 'assistant', content: response },
            ],
        });

        await prisma.userActivity.create({
            data: {
                userId,
                action: 'ai_chat',
                entityType: 'chat',
                entityId: currentSessionId,
                metadata: { context },
            },
        });

        return { response, sessionId: currentSessionId };
    }

    /**
     * Executes highly restricted schema parsing evaluating submitted applicant matrices generating deterministic
     * heuristic scores aligning against ATS compatibility thresholds.
     * 
     * @param {number} userId - Identifies applicant origin mapping persistence constraints.
     * @param {string} resumeText - Unstructured text string encapsulating longitudinal employment schemas.
     * @returns {Promise<ResumeReviewResult>} Deserialized JSON structure presenting specific critique evaluations.
     */
    async reviewResume(userId: number, resumeText: string): Promise<ResumeReviewResult> {
        const client = this.getClient();

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: { skills: { include: { skill: true } } },
        });

        const prompt = `Analyze this resume and provide a JSON response with the following structure:
{
  "overallScore": <0-100>,
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "atsScore": <0-100>
}

Target skills for this professional: ${(profile?.skills || []).map((s: any) => s.skill.name).join(', ') || 'General professional'}

Resume:
${resumeText}`;

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.getSystemPrompt('resume_review') },
                { role: 'user', content: prompt },
            ],
            max_tokens: 2000,
            temperature: 0.3,
            response_format: { type: 'json_object' },
        });

        const responseText = completion.choices[0]?.message?.content || '{}';

        try {
            const result = JSON.parse(responseText) as ResumeReviewResult;
            return result;
        } catch {
            return {
                overallScore: 0,
                strengths: [],
                improvements: ['Unable to parse resume review'],
                suggestions: ['Please try again or contact support'],
                atsScore: 0,
            };
        }
    }

    /**
     * Transmits raw immutable database streams representing historical node interactions sequentially sorted.
     * 
     * @param {number} userId - Identifies subject ledger scopes.
     * @param {string} sessionId - Evaluates constraints targeting particular threaded instances.
     * @returns {Promise<any[]>} Unfiltered array detailing chronologically continuous chat histories.
     */
    async getChatHistory(userId: number, sessionId: string) {
        return prisma.chatHistory.findMany({
            where: { userId, sessionId },
            orderBy: { createdAt: 'asc' },
        });
    }

    /**
     * Extracts consolidated root definitions tracking bifurcated independent generative sequences bridging diverse topics.
     * 
     * @param {number} userId - Determines database bounding boxes guaranteeing multi-tenant isolation.
     * @returns {Promise<any[]>} Collections presenting metadata overviews delineating available interaction environments.
     */
    async getChatSessions(userId: number) {
        const sessions = await prisma.chatHistory.findMany({
            where: { userId },
            distinct: ['sessionId'],
            orderBy: { createdAt: 'desc' },
            select: { sessionId: true, createdAt: true, content: true },
        });

        return sessions.map((s: { sessionId: string; createdAt: Date; content: string }) => ({
            sessionId: s.sessionId,
            createdAt: s.createdAt,
            preview: s.content.substring(0, 100),
        }));
    }

    /**
     * Permanently purges target contextual trees isolating targeted thread instances enforcing deletion topologies.
     * 
     * @param {number} userId - Ensures scope validation avoiding unauthorized cross-tenant modifications.
     * @param {string} sessionId - Resolves discrete primary identity strings designating target matrices.
     * @returns {Promise<void>} Executes resolution following final synchronous confirmation of deletion.
     */
    async deleteChatSession(userId: number, sessionId: string) {
        await prisma.chatHistory.deleteMany({
            where: { userId, sessionId },
        });
    }

    /**
     * Interprets multifaceted unstructured data blocks mapping user topological properties onto discrete targeted corporate descriptions.
     * 
     * @param {number} userId - Retrieves underlying identity metadata validating foundational assertions.
     * @param {string} jobDescription - Provides narrative constraints targeting corporate terminology preferences.
     * @param {'professional' | 'enthusiastic' | 'creative'} [tone='professional'] - Parameterized tonal configuration governing stylistic language output.
     * @returns {Promise<{ coverLetter: string; variations: string[] }>} Complex object isolating fully formed letters alongside structural variations.
     */
    async generateCoverLetter(
        userId: number,
        jobDescription: string,
        tone: 'professional' | 'enthusiastic' | 'creative' = 'professional'
    ): Promise<{ coverLetter: string; variations: string[] }> {
        const client = this.getClient();

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                skills: { include: { skill: true } },
                workExperience: { orderBy: { startDate: 'desc' }, take: 3 },
            },
        });

        const profileContext = profile
            ? `Applicant Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Headline: ${profile.headline || 'Professional'}
- Summary: ${profile.summary || ''}
- Skills: ${(profile.skills || []).map((s: any) => s.skill.name).join(', ')}
- Experience: ${(profile.workExperience || []).map((e: any) => `${e.title} at ${e.company}`).join('; ')}`
            : 'Applicant profile not available.';

        const prompt = `Write a ${tone} cover letter for the following job. Then write a SHORT alternative variation (2-3 sentences opening only).

Return a JSON object with:
{
  "coverLetter": "<full cover letter>",
  "variations": ["<alternative opening 1>", "<alternative opening 2>"]
}

${profileContext}

Job Description:
${jobDescription}`;

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.getSystemPrompt('cover_letter') },
                { role: 'user', content: prompt },
            ],
            max_tokens: 2000,
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0]?.message?.content || '{}';

        try {
            return JSON.parse(raw);
        } catch {
            return { coverLetter: raw, variations: [] };
        }
    }

    /**
     * Executes parameterized simulations mapping theoretical inquiry constructs reflecting industry-standard interrogation matrices.
     * 
     * @param {number} userId - Identity token determining specific contextual boundaries.
     * @param {string} role - Denotes categorical target domains focusing simulation logic parameters.
     * @param {string} [company] - Constrains generated logic around specific environmental or corporate intelligence.
     * @returns {Promise<{ questions: any[]; tips: string[]; starExamples: string[] }>} Orchestrated pedagogical models resolving educational criteria.
     */
    async interviewPrep(
        userId: number,
        role: string,
        company?: string
    ): Promise<{ questions: any[]; tips: string[]; starExamples: string[] }> {
        const client = this.getClient();

        const prompt = `I need interview preparation for the role: "${role}"${company ? ` at ${company}` : ''}.

Return a JSON object:
{
  "questions": [
    { "category": "Behavioral|Technical|Situational", "question": "...", "hint": "..." }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "starExamples": ["STAR example 1", "STAR example 2"]
}`;

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.getSystemPrompt('interview_prep') },
                { role: 'user', content: prompt },
            ],
            max_tokens: 2000,
            temperature: 0.6,
            response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        try { return JSON.parse(raw); } catch { return { questions: [], tips: [], starExamples: [] }; }
    }

    /**
     * Configures structured dialogue pipelines optimizing compensation discussion trajectories based on market telemetry variables.
     * 
     * @param {number} userId - Isolates programmatic boundary conditions controlling individual response vectors.
     * @param {Object} data - Complex array capturing compensation baselines mapping chronological scope definitions.
     * @returns {Promise<{ benchmarks: any; counterOffer: any; talkingPoints: string[]; emailTemplate: string }>} Asynchronous deployment of statistical bargaining methodologies.
     */
    async salaryNegotiation(
        userId: number,
        data: { currentOffer: number; role: string; location: string; yearsOfExperience: number }
    ): Promise<{ benchmarks: any; counterOffer: any; talkingPoints: string[]; emailTemplate: string }> {
        const client = this.getClient();

        const prompt = `Salary negotiation help:
- Role: ${data.role}
- Location: ${data.location}
- Current Offer: $${data.currentOffer}
- Years of Experience: ${data.yearsOfExperience}

Return JSON:
{
  "benchmarks": { "low": 0, "median": 0, "high": 0, "currency": "USD" },
  "counterOffer": { "suggested": 0, "reasoning": "..." },
  "talkingPoints": ["point 1", "point 2"],
  "emailTemplate": "Dear Hiring Manager..."
}`;

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.getSystemPrompt('salary_negotiation') },
                { role: 'user', content: prompt },
            ],
            max_tokens: 1500,
            temperature: 0.5,
            response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        try { return JSON.parse(raw); } catch { return { benchmarks: {}, counterOffer: {}, talkingPoints: [], emailTemplate: '' }; }
    }

    /**
     * Synthesizes longitudinal topological vertices evaluating logical progressions across multi-year professional timelines.
     * 
     * @param {number} userId - Baseline parameter ensuring isolated data processing arrays.
     * @param {string} currentRole - Describes originating occupational coordinate matrix.
     * @param {string} targetRole - Describes ultimate career graph destination trajectory point.
     * @returns {Promise<{ steps: any[]; skills: string[]; timeline: string; resources: string[] }>} Granular mapping of logical execution bridges required to bridge competency gaps.
     */
    async careerPath(
        userId: number,
        currentRole: string,
        targetRole: string
    ): Promise<{ steps: any[]; skills: string[]; timeline: string; resources: string[] }> {
        const client = this.getClient();

        const prompt = `Career path from "${currentRole}" to "${targetRole}".

Return JSON:
{
  "steps": [ { "step": 1, "title": "...", "description": "...", "duration": "..." } ],
  "skills": ["skill1", "skill2"],
  "timeline": "2-3 years",
  "resources": ["resource 1", "resource 2"]
}`;

        const completion = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: this.getSystemPrompt('career_guidance') },
                { role: 'user', content: prompt },
            ],
            max_tokens: 1500,
            temperature: 0.6,
            response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        try { return JSON.parse(raw); } catch { return { steps: [], skills: [], timeline: '', resources: [] }; }
    }
}

export const aiCoachService = new AiCoachService();
