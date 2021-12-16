export function isValidUsername(username: string) {
    if (typeof username !== 'string') return false
    if (username.length > 64) return false
    return true
}

export function isValidEmail(email: string) {
    if (typeof email !== 'string') return false
    if (email.length > 64) return false
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export function isValidPassword(password: string) {
    if (typeof password !== 'string') return false
    if (password.length > 64) return false
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/.test(password)
}

export function isValidBool(bool: boolean) {
    return typeof bool === 'boolean'
}

export function isValidHttpUrl(str: string) {
    let url

    try {
        url = new URL(str)
    } catch (_) {
        return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
}
