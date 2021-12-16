import { config as load_env } from 'dotenv'
import { FastifyInstance } from 'fastify'
import auth from './auth.js'
import test from './test.js'
import user from './user.js'
load_env()

export default async function (fastify: FastifyInstance) {

    fastify.register(auth, {
        prefix: '/auth'
    })

    fastify.register(user, {
        prefix: '/user'
    })

    fastify.register(test, {
        prefix: '/test'
    })
    
}