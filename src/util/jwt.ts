import jwt from 'jsonwebtoken'
import { User } from '../types/User'

const jwtSigningKey = 'e9a36be091e90219dbee5b094d76aa757863ae3082ea1aef9a711f649da6460d'

export interface JWTPayload {
    user: User
}

export default class JWT {
    static create(payload: JWTPayload) {
        // Create the JWT
        const token = jwt.sign(payload, jwtSigningKey, {
            algorithm: 'HS256',
            expiresIn: '1w',
        })

        return token
    }

    static isValid(token: string) {
        try {
            jwt.verify(token, jwtSigningKey)
            return true
        } catch (err) {
            return false
        }
    }

    static decode(token: string): JWTPayload | undefined {
        try {
            return jwt.decode(token) as JWTPayload
        } catch {
            return
        }
    }
}
