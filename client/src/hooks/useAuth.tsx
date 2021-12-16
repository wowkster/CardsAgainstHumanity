import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { User } from '../types/User'

interface AuthContextType {
    user: User | null
    setUser: (user: User) => void
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const [user, setUser] = useState<User | null>(null)

    const logout = async () => {
        await fetch('/api/v1/auth/logout', {
            method: 'DELETE',
        })
        setUser(null)
    }

    const memoedValue = useMemo(
        () => ({
            user,
            setUser,
            logout,
        }),
        [user]
    )

    return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
}

export default function useAuth() {
    return useContext(AuthContext)
}
