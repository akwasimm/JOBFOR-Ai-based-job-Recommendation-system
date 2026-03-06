import { prisma } from '@/config/database';
import { AppError, calculateProfileCompletion } from '@/utils/helpers';
import { cacheService } from './cache.service';

/**
 * Core business methodology encompassing data integrity bindings linking unstructured identity attributes
 * into rigid scalable relational representations mapping professional histories natively.
 * 
 * @class ProfileService
 */
export class ProfileService {
    /**
     * Executes extensive database interactions parsing deep interrelated parameters mapping nested educational, technical, and experiential boundaries natively preserving chronology logic accurately.
     * 
     * @param {number} userId - Identifies requested contextual blocks bridging isolated persistent domains.
     * @returns {Promise<any>} Relays overarching metadata mappings capturing unified contextual records entirely.
     * @throws {AppError} Elevates HTTP 404 unmapped failure states ensuring precise validation requirements.
     */
    async getProfile(userId: number) {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                skills: { include: { skill: true }, orderBy: { createdAt: 'desc' } },
                workExperience: { orderBy: { startDate: 'desc' } },
                education: { orderBy: { startDate: 'desc' } },
                certifications: { orderBy: { issueDate: 'desc' } },
            },
        });

        if (!profile) {
            throw new AppError('Profile not found.', 404);
        }

        return profile;
    }

    /**
     * Enacts atomic revisions tracking differential properties navigating localized subsets modifying core profile fields whilst continuously guaranteeing proportional recalculations subsequently.
     * 
     * @param {number} userId - Internal token providing mapping assertions guaranteeing proper authorization routes securely.
     * @param {any} data - Replaced properties representing new mapping values destined for database persistence updates natively.
     * @returns {Promise<any>} Reflects absolute structural updates communicating resultant profile validation.
     * @throws {AppError} Blocks unauthorized changes intercepting unrecognized underlying structural identifiers.
     */
    async updateProfile(userId: number, data: any) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        const updated = await prisma.profile.update({
            where: { userId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                skills: { include: { skill: true } },
                workExperience: true,
                education: true,
                certifications: true,
            },
        });

        const completion = calculateProfileCompletion(updated);
        await prisma.profile.update({
            where: { userId },
            data: { profileCompletion: completion },
        });

        await cacheService.del(`user:${userId}:me`);
        return { ...updated, profileCompletion: completion };
    }

    /**
     * Merges isolated abstract taxonomies mapping global definitions into distinct identity relationships guaranteeing unified analytical vectors minimizing disparate keyword structures natively.
     * 
     * @param {number} userId - Cryptographically derived key determining identity bindings ensuring appropriate edge linking securely.
     * @param {Object} skillData - Parametric object indicating literal competency phrases alongside proportional proficiency indexes.
     * @returns {Promise<any>} Complete relation instance communicating exact database insertion variables finalizing procedural operations.
     * @throws {AppError} Halts modifications intercepting isolated 404 missing user configurations natively.
     */
    async addSkill(userId: number, skillData: { name: string; proficiency: any; yearsOfExp: number }) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        let skill = await prisma.skill.findFirst({
            where: { name: { equals: skillData.name, mode: 'insensitive' } },
        });

        if (!skill) {
            skill = await prisma.skill.create({
                data: { name: skillData.name },
            });
        }

        const existing = await prisma.userSkill.findUnique({
            where: { profileId_skillId: { profileId: profile.id, skillId: skill.id } },
        });

        if (existing) {
            const updated = await prisma.userSkill.update({
                where: { id: existing.id },
                data: { proficiency: skillData.proficiency, yearsOfExp: skillData.yearsOfExp },
                include: { skill: true },
            });
            return updated;
        }

        const userSkill = await prisma.userSkill.create({
            data: {
                profileId: profile.id,
                skillId: skill.id,
                proficiency: skillData.proficiency,
                yearsOfExp: skillData.yearsOfExp,
            },
            include: { skill: true },
        });

        await this.recalculateCompletion(userId);
        return userSkill;
    }

    /**
     * Traverses localized mapping matrices severing explicit bindings neutralizing assigned competency parameters permanently reducing indexable profile width immediately.
     * 
     * @param {number} userId - Maps authorization requirements identifying correct profile manipulation bounds securely.
     * @param {number} userSkillId - Pinpoints targeting parameters resolving correct linkage rows determining targeted destructive endpoints securely.
     * @returns {Promise<void>} Reflects procedural conclusion communicating successful matrix purging seamlessly averting exceptions natively.
     * @throws {AppError} Traps 404 logic preventing out-of-bounds mutation commands targeting unverified nodes.
     */
    async removeSkill(userId: number, userSkillId: number) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        const userSkill = await prisma.userSkill.findFirst({
            where: { id: userSkillId, profileId: profile.id },
        });

        if (!userSkill) throw new AppError('Skill not found.', 404);

        await prisma.userSkill.delete({ where: { id: userSkillId } });
        await this.recalculateCompletion(userId);
    }

    /**
     * Initializes dependent relational tables pushing extensive temporal configurations defining distinct longitudinal arrays encapsulating empirical employment tracking structures natively.
     * 
     * @param {number} userId - Locates baseline boundaries assuring modifications correctly populate respective user profiles definitively.
     * @param {any} data - Maps incoming attributes capturing company, temporal range, and descriptive formatting configurations directly.
     * @returns {Promise<any>} Dispatches instantiated record schemas resolving final validation attributes natively securing accurate persistence mappings.
     * @throws {AppError} Dispatches 404 responses validating accurate core profile dependencies correctly.
     */
    async addExperience(userId: number, data: any) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        const experience = await prisma.workExperience.create({
            data: {
                profileId: profile.id,
                company: data.company,
                title: data.title,
                location: data.location,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                isCurrent: data.isCurrent || false,
                description: data.description,
            },
        });

        await this.recalculateCompletion(userId);
        return experience;
    }

    /**
     * Redefines explicit variables nesting deeply inside existing chronological lists overwriting targeted aspects ensuring localized data structures represent modernized truths effectively.
     * 
     * @param {number} userId - Protects isolation levels prohibiting intersecting modifications scaling outside explicit parameters definitively.
     * @param {number} experienceId - Captures the localized numeric row index driving internal query optimizations natively securing unique targets.
     * @param {any} data - Transmits mutation constraints guiding localized overwrites directly into bounded persistence vectors.
     * @returns {Promise<any>} Acknowledges synchronous operations projecting updated data arrays encapsulating new validation metrics effectively.
     * @throws {AppError} Distributes localized 404s nullifying transactions upon resolving undefined targets natively.
     */
    async updateExperience(userId: number, experienceId: number, data: any) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        const experience = await prisma.workExperience.findFirst({
            where: { id: experienceId, profileId: profile.id },
        });

        if (!experience) throw new AppError('Experience not found.', 404);

        const updated = await prisma.workExperience.update({
            where: { id: experienceId },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });

        await cacheService.del(`user:${userId}:me`);
        return updated;
    }

    /**
     * Executes hard deletions nullifying chronologically integrated sub-components dismantling specific temporal blocks representing out-dated employment mappings completely.
     * 
     * @param {number} userId - Secures application layer resolving explicit identity authorization gates natively isolating records successfully.
     * @param {number} experienceId - Coordinates specific relational indices guaranteeing targeted removal operations bypass interconnected entities properly.
     * @returns {Promise<void>} Generates definitive silence confirming final execution preventing background processes interfering dynamically.
     * @throws {AppError} Ensures robust bounds preventing destructive actions mapping against incorrect profile trees definitively generating HTTP 404s.
     */
    async deleteExperience(userId: number, experienceId: number) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        const experience = await prisma.workExperience.findFirst({
            where: { id: experienceId, profileId: profile.id },
        });

        if (!experience) throw new AppError('Experience not found.', 404);
        await prisma.workExperience.delete({ where: { id: experienceId } });
        await this.recalculateCompletion(userId);
    }

    /**
     * Appends academic persistence tables mapping discrete topological nodes identifying scholarly establishments correlating explicit certification values directly defining pedagogical trajectories definitively.
     * 
     * @param {number} userId - Imposes categorical logic determining bounded isolation verifying proper relation edge insertion routes effectively.
     * @param {any} data - Identifies attributes resolving degree names, timelines, and specialized hierarchical markers representing valid academic parameters.
     * @returns {Promise<any>} Orchestrates payload response acknowledging absolute write success returning localized identifiers driving distinct interface elements definitively.
     * @throws {AppError} Instantiates validation failures producing reliable 404 error matrices trapping incorrect parent dependencies correctly.
     */
    async addEducation(userId: number, data: any) {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (!profile) throw new AppError('Profile not found.', 404);

        const education = await prisma.education.create({
            data: {
                profileId: profile.id,
                institution: data.institution,
                degree: data.degree,
                field: data.field,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                grade: data.grade,
            },
        });

        await this.recalculateCompletion(userId);
        return education;
    }

    /**
     * Incorporates mathematical division models evaluating composite object density generating relative percentages distinguishing partially empty topological graphs identifying gamification loops distinctly.
     * 
     * @param {number} userId - Pinpoints subject bounds enabling precise traversal methodologies calculating discrete sub-components effectively natively.
     * @returns {Promise<any>} Dispatches hierarchical arrays segregating overarching completeness parameters resolving distinct sectoral progress representations interactively.
     */
    async getCompletion(userId: number) {
        const profile = await this.getProfile(userId);
        return {
            completion: calculateProfileCompletion(profile),
            sections: {
                basicInfo: this.calculateBasicInfoCompletion(profile),
                skills: Math.min((profile.skills?.length || 0) / 3, 1) * 100,
                experience: Math.min((profile.workExperience?.length || 0), 1) * 100,
                education: Math.min((profile.education?.length || 0), 1) * 100,
                preferences: this.calculatePreferencesCompletion(profile),
            },
        };
    }

    /**
     * Computes localized fractional subsets traversing basic semantic schemas dividing explicitly resolved string values indicating nominal progress parameters mathematically.
     * 
     * @param {any} profile - Ingests deeply populated hierarchical matrices evaluating explicit parameter completeness recursively.
     * @returns {number} Scalar percentage bounding simple completion integers resolving between absolute minimum and absolute maximum logic constraints strictly.
     */
    private calculateBasicInfoCompletion(profile: any): number {
        const fields = ['firstName', 'lastName', 'phone', 'headline'];
        const filled = fields.filter((f) => profile[f]).length;
        return (filled / fields.length) * 100;
    }

    /**
     * Isolates configuration constraints scanning boolean combinations defining personalized user interface boundaries measuring overall mapping completeness systematically establishing metric benchmarks definitively.
     * 
     * @param {any} profile - Evaluates top-level relational objects discovering embedded variables corresponding precisely towards optional user expectations.
     * @returns {number} Fractional outcome designating explicit completion indexes directing user behaviors definitively.
     */
    private calculatePreferencesCompletion(profile: any): number {
        const fields = ['preferredLocations', 'expectedSalaryMin', 'preferredJobTypes'];
        const filled = fields.filter((f) => {
            const val = profile[f];
            return val && (Array.isArray(val) ? val.length > 0 : true);
        }).length;
        return (filled / fields.length) * 100;
    }

    /**
     * Operates background programmatic logic recalculating dense profile parameters executing asynchronous cache invalidation loops maintaining structural coherence propagating absolute database limits definitively.
     * 
     * @param {number} userId - Limits recursive scope parameters directly linking mathematical outputs guaranteeing targeted metric distribution securely natively.
     * @returns {Promise<void>} Executed autonomously ensuring zero interruptions blocking immediate user requests validating underlying changes completely invisibly.
     */
    private async recalculateCompletion(userId: number) {
        const profile = await this.getProfile(userId);
        const completion = calculateProfileCompletion(profile);
        await prisma.profile.update({
            where: { userId },
            data: { profileCompletion: completion },
        });
        await cacheService.del(`user:${userId}:me`);
    }
}

export const profileService = new ProfileService();
