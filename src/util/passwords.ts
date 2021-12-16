import crypto from 'crypto'

export function hash(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, `sha512`).toString(`hex`)

    return [salt, hash].join('$')
}

export function validate(password: string, hash: string | null) {
    if (!hash) return false

    const salt = hash.split('$')[0]
    const originalHash = hash.split('$')[1]

    const computedHash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex')

    return computedHash === originalHash
}
