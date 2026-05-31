export interface JWTPayload {
    sub:   string
    email: string
    name:  string
    iat?:  number
    exp?:  number
}

declare global {
    namespace Express {
        interface User {
            _id:      string
            email:    string
            name:     string
            picture?: string
        }
    }
}
