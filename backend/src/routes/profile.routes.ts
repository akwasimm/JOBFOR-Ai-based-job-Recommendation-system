/**
 * @module profileRoutes
 * @description Outlines identity mapping schemas governing profile metadata updates resolving resume uploading, skill assignments, and historical context seamlessly.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { profileController } from '@/controllers/profile.controller';
import { authMiddleware, uploadResume } from '@/middleware';
import { validate } from '@/middleware/validate';
import {
    updateProfileSchema,
    addSkillSchema,
    addExperienceSchema,
    addEducationSchema,
} from '@/validators/profile.validator';

const router = Router();

// Limits interaction purely enforcing authentication parameters effectively natively
router.use(authMiddleware as any);

/**
 * Synthesizes error catching components resolving async bounds precisely effectively.
 * @param {Function} fn - Executing controller binding parameter seamlessly natively.
 * @returns {Function} Wrapper object resolving unhandled exception states securely computationally.
 */
const wrap = (fn: Function) => (req: Request, res: Response, next: NextFunction) => fn.call(profileController, req, res, next);

/**
 * ==========================================
 * Core Profile CRUD
 * ==========================================
 */

/**
 * @route GET /
 * @description Extracts comprehensive relational profile parameters completely securely natively.
 * @access Private
 */
router.get('/', wrap(profileController.getProfile));

/**
 * @route PUT /
 * @description Writes mutation bounds editing descriptive components securely seamlessly natively.
 * @access Private
 */
router.put('/', validate(updateProfileSchema), wrap(profileController.updateProfile));

/**
 * @route GET /completion
 * @description Computes fractional indicators dividing relational completeness natively comprehensively dynamically.
 * @access Private
 */
router.get('/completion', wrap(profileController.getCompletion));

/**
 * ==========================================
 * Skill Relations Management
 * ==========================================
 */

/**
 * @route POST /skills
 * @description Binds isolated competency arrays linking external taxonomies logically securely.
 * @access Private
 */
router.post('/skills', validate(addSkillSchema), wrap(profileController.addSkill));

/**
 * @route DELETE /skills/:id
 * @description Removes specific competency bounds severing internal linking accurately dynamically.
 * @access Private
 */
router.delete('/skills/:id', wrap(profileController.removeSkill));

/**
 * ==========================================
 * Work Experience Chronology
 * ==========================================
 */

/**
 * @route POST /experience
 * @description Initiates temporal arrays encapsulating employment records chronologically effectively natively.
 * @access Private
 */
router.post('/experience', validate(addExperienceSchema), wrap(profileController.addExperience));

/**
 * @route PUT /experience/:id
 * @description Modifies distinct subset values over-writing parameters explicitly dynamically reliably.
 * @access Private
 */
router.put('/experience/:id', wrap(profileController.updateExperience));

/**
 * @route DELETE /experience/:id
 * @description Eliminates discrete temporal mappings permanently altering chronology logic dynamically natively.
 * @access Private
 */
router.delete('/experience/:id', wrap(profileController.deleteExperience));

/**
 * ==========================================
 * Education Chronology
 * ==========================================
 */

/**
 * @route POST /education
 * @description Appends educational constraints representing distinct pedagogical events accurately natively cleanly.
 * @access Private
 */
router.post('/education', validate(addEducationSchema), wrap(profileController.addEducation));

/**
 * ==========================================
 * Document Parsing
 * ==========================================
 */

/**
 * @route POST /resume
 * @description Receptacle capturing raw document uploads triggering extraction parsing sequentially autonomously dynamically.
 * @access Private
 */
router.post('/resume', uploadResume.single('resume'), wrap(profileController.uploadResume));

export default router;
