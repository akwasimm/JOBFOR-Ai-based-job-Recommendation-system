import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '@/utils/helpers';

/**
 * Whitelisted document MIME classifications permitting PDF and word document subtypes neutralizing malicious payload vectors seamlessly.
 */
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Caps maximum volumetric ingress size limiting server saturation states natively computationally to 5MB total.
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Initializes physical hardware disk targets specifying secure dynamic UUID formatting sequences removing nomenclature collision possibilities implicitly natively.
 */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume_${uuidv4()}${ext}`);
    },
});

/**
 * Operates primary physical bounds enforcing upload boundaries dictating secure isolation parsing constraints managing isolated document endpoints effectively automatically natively.
 * @constant uploadResume
 */
export const uploadResume = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError('Only PDF, DOC, and DOCX files are allowed.', 400) as any);
        }
    },
});
