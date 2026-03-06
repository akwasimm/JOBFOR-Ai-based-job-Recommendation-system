import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    phone: z.string().max(20).optional(),
    headline: z.string().max(200).optional(),
    summary: z.string().max(2000).optional(),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    currentCompany: z.string().max(100).optional(),
    currentTitle: z.string().max(100).optional(),
    experienceYears: z.number().int().min(0).max(50).optional(),
    preferredLocations: z.array(z.string()).optional(),
    remotePreference: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).optional(),
    expectedSalaryMin: z.number().int().min(0).optional(),
    expectedSalaryMax: z.number().int().min(0).optional(),
    preferredJobTypes: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'TEMPORARY'])).optional(),
});

export const addSkillSchema = z.object({
    name: z.string().min(1, 'Skill name is required').max(100),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('INTERMEDIATE'),
    yearsOfExp: z.number().int().min(0).max(50).default(0),
});

export const addExperienceSchema = z.object({
    company: z.string().min(1, 'Company name is required').max(100),
    title: z.string().min(1, 'Job title is required').max(100),
    location: z.string().max(100).optional(),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    isCurrent: z.boolean().default(false),
    description: z.string().max(2000).optional(),
});

export const addEducationSchema = z.object({
    institution: z.string().min(1, 'Institution name is required').max(200),
    degree: z.string().min(1, 'Degree is required').max(100),
    field: z.string().max(100).optional(),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    grade: z.string().max(20).optional(),
});

export const jobSearchSchema = z.object({
    query: z.string().min(1).max(200).optional(),
    location: z.string().max(100).optional(),
    jobType: z.preprocess((val) => typeof val === 'string' ? val.split(',') : val, z.array(z.string())).optional(),
    experienceLevel: z.preprocess((val) => typeof val === 'string' ? val.split(',') : val, z.array(z.string())).optional(),
    salaryMin: z.coerce.number().int().min(0).optional(),
    salaryMax: z.coerce.number().int().min(0).optional(),
    remote: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    sortBy: z.enum(['relevance', 'date', 'salary']).default('relevance'),
});

export const saveJobSchema = z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    jobData: z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        applyUrl: z.string().optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        skills: z.array(z.string()).optional(),
        matchScore: z.number().optional(),
    }),
    notes: z.string().max(1000).optional(),
    folder: z.string().max(50).optional(),
    tags: z.array(z.string()).optional(),
});

export const applyJobSchema = z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    jobData: z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        applyUrl: z.string().optional(),
    }),
    resumeUsed: z.string().optional(),
    coverLetter: z.string().optional(),
    notes: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
    status: z.enum([
        'SAVED', 'APPLIED', 'VIEWED', 'SCREENING',
        'INTERVIEWING', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN',
    ]),
    notes: z.string().optional(),
    interviewDate: z.string().datetime().optional(),
    followUpDate: z.string().datetime().optional(),
});

export const chatMessageSchema = z.object({
    message: z.string().min(1, 'Message is required').max(4000),
    sessionId: z.string().optional(),
    context: z.enum(['general', 'resume_review', 'interview_prep', 'cover_letter', 'salary_negotiation', 'career_guidance']).default('general'),
});

export const createAlertSchema = z.object({
    name: z.string().min(1).max(100),
    query: z.string().min(1).max(200),
    location: z.string().max(100).optional(),
    jobTypes: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'TEMPORARY'])).optional(),
    remoteOnly: z.boolean().default(false),
    salaryMin: z.number().int().min(0).optional(),
    frequency: z.enum(['daily', 'weekly', 'instant']).default('daily'),
});
