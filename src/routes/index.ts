import { config as load_env } from 'dotenv'
import { FastifyInstance } from 'fastify'
import auth from './auth'
import user from './user'
load_env()

export default async function (fastify: FastifyInstance) {

    fastify.register(auth, {
        prefix: '/auth'
    })

    fastify.register(user, {
        prefix: '/api/user'
    })
}