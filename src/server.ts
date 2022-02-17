import { config } from 'dotenv'
config()

import createFastify, { FastifyReply } from 'fastify'
import fastifyNextJs from 'fastify-nextjs'
import cors from 'fastify-cors'
import cookie from 'fastify-cookie'
import fastifyOauth2, { OAuth2Namespace } from 'fastify-oauth2'
import middie from 'middie'
import formBody from 'fastify-formbody'
import fastifySocketIO from 'fastify-socket.io'
import router from './routes/index'

import { MONGO_CLIENT } from './util/mongo'
import authPlugin from './plugins/authPlugin'
import jsonReplyPlugin from './plugins/jsonReplyPlugin'
import { providers } from './OAuthSettings'
import { CAH } from './lib/game/server'

declare module 'fastify' {
    interface FastifyInstance {
        google: OAuth2Namespace;
        github: OAuth2Namespace;
        discord: OAuth2Namespace;
    }
}

const fastify = createFastify({
    logger: 1 == 1 ? false : {
        level: 'debug',
        prettyPrint:
            process.env.NODE_ENV === 'development'
                ? {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                }
                : false,
    },
    ignoreTrailingSlash: true,
    pluginTimeout: 20000,
    trustProxy: true,
})

const main = async () => {
    // @ts-ignore
    await fastify.register(formBody, {
        parser: body => body
    })
    await fastify.register(cors)
    await fastify.register(cookie)
    await fastify.register(middie)
    await fastify.register(authPlugin)
    await fastify.register(jsonReplyPlugin)

    await fastify.register(fastifySocketIO, {
        path: '/socket.io',
        serveClient: false,
        // below are engine.IO options
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
    })

    // @ts-ignore
    await fastify.register(fastifyNextJs, {
        dev: process.env.NODE_ENV !== 'production',
        logLevel: "debug",
        noServeAssets: false,
    }).after(() => {
        fastify.next('/')
        fastify.next('/login')
        fastify.next('/terms')
        fastify.next('/room')
        fastify.next('/room/*')
        fastify.next('/settings')
    })

    await Promise.all(providers.map(provider => fastify.register(fastifyOauth2, provider)))

    await fastify.register(router)

    CAH.instance = new CAH(fastify)

    try {
        await MONGO_CLIENT.connect()
        const PORT = process.env.HTTP_PORT ?? 5000

        await fastify.listen(PORT, '0.0.0.0')
        console.log(`Listening on http://localhost:${PORT}`)

    } catch (err) {
        console.log('Error: ', err)
        process.exit(1)
    }
}

main()