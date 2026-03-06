import { prisma } from '@/config/database';
import { AppError } from '@/utils/helpers';

/**
 * Enterprise service component managing user-job relational tracking matrices, comprehensive pipeline statistics,
 * and scalable automation paradigms regarding background alert triggers.
 * 
 * @class ApplicationService
 */
export class ApplicationService {
    /**
     * Ingests specified identifiers to initialize durable mappings tracking potential corporate employment opportunities.
     * Ensures strict idempotency regarding duplicate mapping attempts per individual scope.
     * 
     * @param {number} userId - Cryptographically validated key associating state with isolated tenant profiles.
     * @param {any} data - Object array packaging granular metadata relating to categorical grouping identifiers.
     * @returns {Promise<any>} Execution mapping structure signaling correct underlying insert protocol finality.
     * @throws {AppError} Enacts a 400 Fault if the mapping node is previously discovered within local ledgers.
     */
    async saveJob(userId: number, data: any) {
        const existing = await prisma.savedJob.findUnique({
            where: { userId_jobId: { userId, jobId: data.jobId } },
        });

        if (existing) {
            throw new AppError('Job already saved.', 400);
        }

        return prisma.savedJob.create({
            data: {
                userId,
                jobId: data.jobId,
                jobData: data.jobData,
                notes: data.notes,
                folder: data.folder || 'default',
                tags: data.tags || [],
            },
        });
    }

    /**
     * Selectively enumerates established retention records aligning against optional hierarchical taxonomies.
     * 
     * @param {number} userId - Establishes absolute boundary validating access layers representing singular entities.
     * @param {string} [folder] - Filter constraint identifying targeted relational subsets isolated dynamically.
     * @returns {Promise<any[]>} Returns chronologically descended chronological maps of bounded opportunities.
     */
    async getSavedJobs(userId: number, folder?: string) {
        return prisma.savedJob.findMany({
            where: { userId, ...(folder ? { folder } : {}) },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Executes targeted garbage collection terminating linkage edges mapping specific opportunities to persistent boundaries.
     * 
     * @param {number} userId - Identifies authorization scope blocking non-permissioned deletion processes.
     * @param {number} savedJobId - Cardinal reference pointing to absolute relational edge schema strings.
     * @returns {Promise<void>} Signifies asynchronous completion of deletion logic within target matrices.
     * @throws {AppError} Dispatches a 404 Fault when the targeting parameters lack valid relational edges.
     */
    async unsaveJob(userId: number, savedJobId: number) {
        const savedJob = await prisma.savedJob.findFirst({
            where: { id: savedJobId, userId },
        });

        if (!savedJob) throw new AppError('Saved job not found.', 404);

        await prisma.savedJob.delete({ where: { id: savedJobId } });
    }

    /**
     * Elevates transient interaction relationships into robust submission arrays enabling comprehensive tracking mechanisms
     * charting progressive categorical states bridging internal applicant capabilities and corporate portals.
     * 
     * @param {number} userId - Root context establishing operational ownership vectors.
     * @param {any} data - Bundles structural records dictating associated documentation links modifying logic bounds.
     * @returns {Promise<any>} Relays immutable structural object defining initial baseline pipeline properties.
     * @throws {AppError} Validates application status averting duplicate 400 fault conflicts over single entity targets.
     */
    async applyToJob(userId: number, data: any) {
        const existing = await prisma.jobApplication.findUnique({
            where: { userId_jobId: { userId, jobId: data.jobId } },
        });

        if (existing) {
            throw new AppError('Already applied to this job.', 400);
        }

        return prisma.jobApplication.create({
            data: {
                userId,
                jobId: data.jobId,
                jobData: data.jobData,
                status: 'APPLIED',
                resumeUsed: data.resumeUsed,
                coverLetter: data.coverLetter,
                notes: data.notes,
            },
        });
    }

    /**
     * Translates comprehensive relational history trees mapping exhaustive submissions across external business entities.
     * 
     * @param {number} userId - Confines traversal loops exclusively honoring isolated scope definitions.
     * @param {string} [status] - Disseminates targeted parameter constraints matching state machine enumeration structures.
     * @returns {Promise<any[]>} Extrapolates sorted array architectures tracking chronological submission density.
     */
    async getApplications(userId: number, status?: string) {
        return prisma.jobApplication.findMany({
            where: {
                userId,
                ...(status ? { status: status as any } : {}),
            },
            orderBy: { appliedAt: 'desc' },
        });
    }

    /**
     * Mutates programmatic machine states facilitating complex transitions traversing varied stage gate evaluations.
     * 
     * @param {number} userId - Determines fundamental bounds enforcing tenant-data linkage verification.
     * @param {number} applicationId - Navigates precise underlying index targeting distinct application vectors.
     * @param {any} data - Identifies modified parameter transitions shifting pipeline status attributes.
     * @returns {Promise<any>} Ensures systematic state convergence communicating valid update sequences.
     * @throws {AppError} Elevates runtime exception indicating absence of targeted mapping object references.
     */
    async updateApplicationStatus(userId: number, applicationId: number, data: any) {
        const application = await prisma.jobApplication.findFirst({
            where: { id: applicationId, userId },
        });

        if (!application) throw new AppError('Application not found.', 404);

        return prisma.jobApplication.update({
            where: { id: applicationId },
            data: {
                status: data.status,
                notes: data.notes || application.notes,
                interviewDate: data.interviewDate ? new Date(data.interviewDate) : application.interviewDate,
                followUpDate: data.followUpDate ? new Date(data.followUpDate) : application.followUpDate,
            },
        });
    }

    /**
     * Calculates mathematical ratio reductions aggregating progressive performance funnels measuring conversion heuristics.
     * 
     * @param {number} userId - Isolates specific analytics mapping toward singular operational environments.
     * @returns {Promise<any>} Composite JSON tree exposing fractional stage completions governing overall outcomes.
     */
    async getApplicationStats(userId: number) {
        const applications = await prisma.jobApplication.findMany({
            where: { userId },
        });

        const stats = {
            total: applications.length,
            applied: applications.filter((a: { status: string }) => a.status === 'APPLIED').length,
            viewed: applications.filter((a: { status: string }) => a.status === 'VIEWED').length,
            screening: applications.filter((a: { status: string }) => a.status === 'SCREENING').length,
            interviewing: applications.filter((a: { status: string }) => a.status === 'INTERVIEWING').length,
            offered: applications.filter((a: { status: string }) => a.status === 'OFFERED').length,
            accepted: applications.filter((a: { status: string }) => a.status === 'ACCEPTED').length,
            rejected: applications.filter((a: { status: string }) => a.status === 'REJECTED').length,
            withdrawn: applications.filter((a: { status: string }) => a.status === 'WITHDRAWN').length,
            responseRate: 0,
            interviewRate: 0,
            offerRate: 0,
        };

        if (stats.total > 0) {
            const responded = stats.viewed + stats.screening + stats.interviewing + stats.offered + stats.accepted + stats.rejected;
            stats.responseRate = Math.round((responded / stats.total) * 100);
            stats.interviewRate = Math.round(((stats.interviewing + stats.offered + stats.accepted) / stats.total) * 100);
            stats.offerRate = Math.round(((stats.offered + stats.accepted) / stats.total) * 100);
        }

        return stats;
    }

    /**
     * Initializes temporal automation routines subscribing parameterized search dimensions to background daemon schedulers.
     * 
     * @param {number} userId - Identifies principal tracking context required for targeted dispatch operations.
     * @param {any} data - Complex query taxonomy mapping semantic vectors against scheduled polling sequences.
     * @returns {Promise<any>} Transmits resulting configuration index bridging internal metrics with outbound communication arrays.
     */
    async createAlert(userId: number, data: any) {
        return prisma.jobAlert.create({
            data: {
                userId,
                name: data.name,
                query: data.query,
                location: data.location || null,
                jobTypes: data.jobTypes || [],
                remoteOnly: data.remoteOnly || false,
                salaryMin: data.salaryMin || null,
                frequency: data.frequency || 'daily',
                isActive: true,
            },
        });
    }

    /**
     * Resolves currently active configuration profiles tracking asynchronous notification deployments executing externally.
     * 
     * @param {number} userId - Establishes bounds isolating unique cron management tables structurally.
     * @returns {Promise<any[]>} Asynchronous payload returning chronologically mapped polling job models.
     */
    async getAlerts(userId: number) {
        return prisma.jobAlert.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Retracts and obliterates asynchronous event triggers completely severing backend cron dependencies tied to scope entities.
     * 
     * @param {number} userId - Authenticated context verifying secure execution parameter bounds.
     * @param {number} alertId - Explicit numeric pointer terminating particular background sequences.
     * @returns {Promise<void>} Output signifying systemic normalization acknowledging removed event schedules.
     * @throws {AppError} Dispatches 404 validation failures blocking malformed synchronization queries.
     */
    async deleteAlert(userId: number, alertId: number) {
        const alert = await prisma.jobAlert.findFirst({
            where: { id: alertId, userId },
        });

        if (!alert) throw new AppError('Alert not found.', 404);

        await prisma.jobAlert.delete({ where: { id: alertId } });
    }
}

export const applicationService = new ApplicationService();
