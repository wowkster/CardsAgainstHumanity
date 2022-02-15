import { NextRouter, useRouter } from "next/router"
import { OAuthProvider } from "./fastifyAuth"

export const signIn = (provider: OAuthProvider, router: NextRouter) => {
    router.push(provider.loginPath)
}