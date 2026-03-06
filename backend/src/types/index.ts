import { Request } from 'express';
import { User } from '@prisma/client';

// ─── Authenticated Request ──────────────────────────────
export interface AuthRequest extends Request {
    user?: User;
}

// ─── API Response Types ─────────────────────────────────
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ─── Job Types ──────────────────────────────────────────
export interface NormalizedJob {
    externalId: string;
    source: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    jobType?: string;
    experienceLevel?: string;
    isRemote: boolean;
    skills: string[];
    applyUrl: string;
    postedAt?: Date;
    expiresAt?: Date;
}

export interface JobSearchParams {
    query: string;
    location?: string;
    jobType?: string[];
    experienceLevel?: string[];
    salaryMin?: number;
    salaryMax?: number;
    remote?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'relevance' | 'date' | 'salary';
}

export interface JobSearchResult {
    jobs: NormalizedJob[];
    total: number;
    page: number;
    limit: number;
}

// ─── Recommendation Types ───────────────────────────────
export interface MatchBreakdown {
    skillMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryMatch: number;
    textSimilarity: number;
    overallScore: number;
    matchingSkills: string[];
    missingSkills: string[];
}

export interface RecommendedJob extends NormalizedJob {
    matchScore: number;
    matchBreakdown: MatchBreakdown;
}

// ─── AI Types ───────────────────────────────────────────
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ResumeReviewResult {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    atsScore: number;
}

// ─── Market Insights Types ──────────────────────────────
export interface SalaryInsight {
    role: string;
    location: string;
    min: number;
    median: number;
    max: number;
    currency: string;
    sampleSize: number;
}

export interface SkillDemand {
    skill: string;
    demandPercentage: number;
    trend: 'rising' | 'stable' | 'declining';
    userHasSkill: boolean;
}

export interface MarketTrend {
    totalJobs: number;
    newToday: number;
    growthPercentage: number;
    topHiringCompanies: { name: string; openings: number }[];
}
