import jwt from 'jsonwebtoken'
import fs from 'fs'

const privateKey = fs.readFileSync('keys/private.key')
const publicKey = fs.readFileSync('keys/public.pem')

export interface JWTPayload {
    userId: string
}

export default class JWT {
    static create(payload: JWTPayload) {
        // Create the JWT
        const token = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1w',
        })

        return token
    }

    static isValid(token: string) {
        try {
            jwt.verify(token, publicKey)
            return true
        } catch (err) {
            return false
        }
    }

    static decode(token: string): JWTPayload | null {
        try {
            return jwt.decode(token) as JWTPayload
        } catch {
            return null
        }
    }
}
