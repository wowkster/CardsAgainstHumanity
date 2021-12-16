import { config as load_env } from 'dotenv'
import { FastifyInstance } from 'fastify'
import JWT from '../util/jwt.js'
load_env()

export default async function (fastify: FastifyInstance) {
    fastify.get('/jwt', async (req, res) => {
        res.send(JWT.create({
            user: {
                email: 'jhh@Jhjh.fggd',
                passwordHash: 'dfljdgfg',
                username: 'gfkdfgdfgfdg',
                avatarUrl: 'dfgdfgfgfg',
                usernameHasInit: false,
                isAdmin: false,
            }
        }))
    })
}
