import jwt from 'jsonwebtoken'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import envs from '@/config/env'

// ─── Date / Time (always UTC) ────────────────────────────────────────────────

const getDate = (): string => moment.utc().format('YYYY-MM-DD')

const getTime = (): string => moment.utc().format('HH:mm:ss')

const getDateTime = (): string => moment.utc().format('YYYY-MM-DD HH:mm:ss')

// ─── Error Logger ─────────────────────────────────────────────────────────────

const logError = async (err: any, req?: any): Promise<void> => {
    try {
        const logDir = path.resolve('./logs')

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true })
        }

        const logFile = path.join(logDir, `${getDate()}.log`)

        const entry = [
            `[${getDateTime()} UTC] ${req?.method || 'UNKNOWN'} ${req?.originalUrl || ''}`,
            `Error: ${err?.message || String(err)}`,
            `Stack: ${err?.stack || 'No stack trace'}`,
            '----------------------------------------',
            '',
        ].join('\n')

        fs.appendFileSync(logFile, entry, 'utf8')
    } catch (_) {}
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

const buildToken = (user: any): string => {
    return jwt.sign(
        {
            sub:   user._id.toString(),
            email: user.email,
            name:  user.name,
        },
        envs.secret_key,
        { expiresIn: '7d' }
    )
}

const helpers = { getDate, getTime, getDateTime, logError, buildToken }

export default helpers
