export interface User {
    email: string
    passwordHash: string | null
    username: string
    avatarUrl: string
    usernameHasInit: boolean
    isAdmin: boolean
}

export interface SafeUser {
    email: string
    username: string
    avatarUrl: string
    usernameHasInit: boolean
    isAdmin: boolean
}

export function clientSafeUser(user: User): SafeUser {
    const {email, username, usernameHasInit, avatarUrl, isAdmin} = user
    
    return {email, username, usernameHasInit, avatarUrl, isAdmin}
}