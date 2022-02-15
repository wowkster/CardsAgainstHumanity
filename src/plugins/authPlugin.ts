import { FastifyPluginAsync, preHandlerHookHandler } from 'fastify'
import createPlugin from 'fastify-plugin'
import { DB } from '../lib/mongodb/database'
import { User } from '../lib/models/User'
import JWT, { JWTPayload, } from '../util/jwt'

declare module 'fastify' {
    interface FastifyRequest {
        hasAuthorization: boolean
        jwtPayload: JWTPayload
        user: User
    }

    interface FastifyReply {
        sendNoAuthMessage(): FastifyReply
        sendNoPermsMessage(): FastifyReply
        setJWT(payload: JWTPayload): FastifyReply
        destroyJWT(): FastifyReply
    }
}

// define options
export interface AuthPluginOptions {}

const authPluginAsync: FastifyPluginAsync<AuthPluginOptions> = async (fastify, options) => {
    fastify.decorateRequest('jwtPayload', null)
    fastify.decorateRequest('hasAuthorization', null)
    fastify.decorateRequest('user', null)

    fastify.addHook('preValidation', async (req, res) => {
        // Parse Authorization header and get its payload
        const { cookies } = req
        fastify.log.debug(cookies, 'Request Cookies')
        const accessToken = cookies?.['cah_auth']

        req.hasAuthorization = !!accessToken
        if (!accessToken) return

        // Parse and decrypt jwt payload
        if (!JWT.isValid(accessToken)) return res.reply('Access token is invalid!', 403)

        const payload = JWT.decode(accessToken)
        if (!payload) return res.reply('Access token data is invalid!', 403)

        fastify.log.debug(payload, 'JWT Payload')

        req.jwtPayload = payload

        const user = await DB.getUserFromID(payload.userId)
        if (!user) return res.reply('User is invalid!', 403)

        req.user = user
    })

    fastify.decorateReply('sendNoAuthMessage', function () {
        this.reply('Authorization is required to access this endpoint', 401, {}, 'NO_AUTHORIZATION')
    })

    fastify.decorateReply('sendNoPermsMessage', function () {
        this.reply('Insufficient Permissions to access endpoint', 403, {}, 'NO_PERMISSION')
    })

    fastify.decorateReply('setJWT', function (payload: JWTPayload) {
        const token = JWT.create(payload)
        
        this.setCookie('cah_auth', token, {
            path: '/',
            secure: false,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30
          })
    })
    
    fastify.decorateReply('destroyJWT', function () {
        this.setCookie('cah_auth', '', {
            path: '/',
            secure: false,
            httpOnly: true,
            maxAge: -1
          })
    })
    
}

export default createPlugin(authPluginAsync, {
    fastify: '3.x',
    name: 'cah-auth',
})

export const requireSignedIn: preHandlerHookHandler = (req, res, done) => {
    if (!req.hasAuthorization) return res.sendNoAuthMessage()

    if (!req.user) return res.sendNoPermsMessage()

    done()
}