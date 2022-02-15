import { providers } from "../../OAuthSettings"
import JWT from "../../util/jwt"
import { DB } from "../mongodb/database"
import { FastifySession, OAuthProvider, SSRContext } from "./fastifyAuth"



export const getSession = async (context: SSRContext): Promise<FastifySession | null> => {
    const { req, res } = context
    const { cookies } = req

    const accessToken = cookies?.['cah_auth']
    if (!accessToken) return null

    if (!JWT.isValid(accessToken)) return null

    const payload = JWT.decode(accessToken)
    if (!payload) return null

    const user = await DB.getUserFromID(payload.userId)

    if (!user) return null

    return {
        user
    }
}

export const getProviders = (): OAuthProvider[] => {
    return providers.map(provider => ({
        id: provider.name,
        name: provider.display,
        loginPath: provider.startRedirectPath,
        callbackUri: provider.callbackUri
    }))
}

