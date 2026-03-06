import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/types';
import { profileService } from '@/services/profile.service';
import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data';

/**
 * Controller class governing operations over identity representations incorporating chronological histories,
 * educational foundations, technical capability collections, and parsing ingestion streams.
 * 
 * @class ProfileController
 */
export class ProfileController {
    /**
     * Dispatches comprehensive structural metadata detailing singular identity instances bounded against relational stores.
     * 
     * @param {AuthRequest} req - Internal reference providing foundational request state validation requirements.
     * @param {Response} res - Translates abstractions enabling robust front-end layout configurations.
     * @param {NextFunction} next - Interceptor node designed for upstream fault escalation.
     */
    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const profile = await profileService.getProfile(req.user!.id);
            res.json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Executes atomic partial writes across core profile entity dimensions substituting arbitrary structural bounds.
     * 
     * @param {AuthRequest} req - Application context transporting scalar parameter revisions defining new boundaries.
     * @param {Response} res - Outputs resulting graph mutations reflecting accepted system realities.
     * @param {NextFunction} next - Diagnostics dispatcher mitigating unrecoverable process faults.
     */
    async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const profile = await profileService.updateProfile(req.user!.id, req.body);
            res.json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Introduces supplementary categorical capability definitions anchoring localized ontologies into larger user structures.
     * 
     * @param {AuthRequest} req - Contains JSON mappings declaring explicitly defined capability sets.
     * @param {Response} res - Dispatchable channel logging database insertion operations sequentially.
     * @param {NextFunction} next - Diagnostic routing node for unhandled promise rejections.
     */
    async addSkill(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const skill = await profileService.addSkill(req.user!.id, req.body);
            res.status(201).json({ success: true, data: skill });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Extinguishes specific conceptual capability constraints reducing overall taxonomy breadth logic constraints.
     * 
     * @param {AuthRequest} req - Yields parameterized identity nodes representing specific technical capabilities.
     * @param {Response} res - Conveys absolute confirmation representing destructive execution finality.
     * @param {NextFunction} next - Execution error boundary capturing structural anomalies.
     */
    async removeSkill(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await profileService.removeSkill(req.user!.id, parseInt(req.params.id as string));
            res.json({ success: true, message: 'Skill removed' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Constructs sequentially integrated experience vectors validating functional historical trajectories.
     * 
     * @param {AuthRequest} req - Accepts complex nested temporal records matching firmographic profiles.
     * @param {Response} res - Disseminates 201 acknowledgment mapping abstract relations permanently.
     * @param {NextFunction} next - Error propagation sequence handler.
     */
    async addExperience(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const experience = await profileService.addExperience(req.user!.id, req.body);
            res.status(201).json({ success: true, data: experience });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Alters isolated properties nested within longitudinal experience instances previously integrated into persistence layers.
     * 
     * @param {AuthRequest} req - Context specifying mutable keys requiring relational modifications incrementally.
     * @param {Response} res - Formats returned dataset validating updated relational boundaries.
     * @param {NextFunction} next - Standard asynchronous fallback operation handler.
     */
    async updateExperience(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const experience = await profileService.updateExperience(
                req.user!.id, parseInt(req.params.id as string), req.body
            );
            res.json({ success: true, data: experience });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Isolates and obliterates historically modeled career iterations fundamentally rewriting stored timelines.
     * 
     * @param {AuthRequest} req - Maps designated target blocks identified for deletion logic routines.
     * @param {Response} res - Distributes acknowledgement concluding logical operation requirements.
     * @param {NextFunction} next - Eventual consistency validation and issue fallback conduit.
     */
    async deleteExperience(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await profileService.deleteExperience(req.user!.id, parseInt(req.params.id as string));
            res.json({ success: true, message: 'Experience deleted' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ingests foundational educational parameters expanding personal scholastic credentials into structural hierarchies.
     * 
     * @param {AuthRequest} req - Application context carrying defined attributes for institutional mappings.
     * @param {Response} res - Finalizes HTTP response confirming proper ontological bindings.
     * @param {NextFunction} next - General unhandled error proxy function.
     */
    async addEducation(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const education = await profileService.addEducation(req.user!.id, req.body);
            res.status(201).json({ success: true, data: education });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Bridges multiplexing document parsing services facilitating binary storage preservation alongside
     * deep capability extraction methodologies utilizing Python AI microservices dynamically.
     * 
     * @param {AuthRequest} req - Intercepted HTTP multipart document payload specifying encoded binaries.
     * @param {Response} res - Dispatches analytical summaries bridging static files with operational intelligence.
     * @param {NextFunction} next - Top-level sequence handler for exception catch delegation.
     */
    async uploadResume(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, error: 'No file uploaded' });
                return;
            }

            const resumeUrl = `/uploads/${req.file.filename}`;
            const filePath = req.file.path;

            const profile = await profileService.updateProfile(req.user!.id, {
                resumeUrl,
            });

            let extractedSkills: string[] = [];
            if (req.file.mimetype === 'application/pdf') {
                try {
                    const formData = new FormData();
                    formData.append('file', fs.createReadStream(filePath));

                    const mlRes = await axios.post('http://localhost:8000/parse-resume', formData, {
                        headers: formData.getHeaders(),
                    });

                    if (mlRes.data?.success && mlRes.data.skills) {
                        extractedSkills = mlRes.data.skills;

                        for (const skillName of extractedSkills) {
                            try {
                                await profileService.addSkill(req.user!.id, {
                                    name: skillName,
                                    proficiency: 'INTERMEDIATE',
                                    yearsOfExp: 0,
                                });
                            } catch (e) {

                            }
                        }
                    }
                } catch (mlError) {

                }
            }

            res.json({
                success: true,
                data: { resumeUrl: profile.resumeUrl },
                message: extractedSkills.length > 0
                    ? `Resume uploaded and ${extractedSkills.length} skills automatically extracted!`
                    : 'Resume uploaded successfully.'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generates aggregated mathematical indices representing proportional adherence to mandated schemas supporting
     * programmatic interface gamification or constraint validations.
     * 
     * @param {AuthRequest} req - Encapsulates identity pointers serving analytical metrics.
     * @param {Response} res - Outputs resulting fractional data arrays depicting compliance statistics.
     * @param {NextFunction} next - Bridging pipeline callback for fault propagation.
     */
    async getCompletion(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const completion = await profileService.getCompletion(req.user!.id);
            res.json({ success: true, data: completion });
        } catch (error) {
            next(error);
        }
    }
}

export const profileController = new ProfileController();
