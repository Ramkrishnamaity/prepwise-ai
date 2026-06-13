import multer from 'multer'
import StatusError from '@/utils/helpers/statusError'

const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if (!allowed.includes(file.mimetype)) {
            return cb(StatusError.badRequest('Only PDF and Word files are allowed'))
        }
        cb(null, true)
    },
})

export default uploadMiddleware
