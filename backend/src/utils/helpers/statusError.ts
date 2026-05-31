class StatusError extends Error {
    statusCode: number
    data?: Record<string, any>

    constructor(message: string, statusCode: number = 400, data?: Record<string, any>) {
        super(message)
        this.statusCode = statusCode
        this.data = data
        this.name = 'StatusError'
    }

    static badRequest(message: string, data?: Record<string, any>)              { return new StatusError(message, 400, data) }
    static unauthorized(message = 'Unauthorized', data?: Record<string, any>)   { return new StatusError(message, 401, data) }
    static forbidden(message = 'Forbidden', data?: Record<string, any>)         { return new StatusError(message, 403, data) }
    static notFound(message = 'Not found', data?: Record<string, any>)          { return new StatusError(message, 404, data) }
    static internal(message = 'Server error. Please try again later.', data?: Record<string, any>) { return new StatusError(message, 500, data) }
}

export default StatusError
