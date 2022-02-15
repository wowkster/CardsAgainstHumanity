import { config as load_env } from 'dotenv'
import { FastifyInstance } from 'fastify'
import { getDocument, updateDocument } from '../util/mongo'
import { isValidBool, isValidEmail, isValidHttpUrl, isValidUsername } from '../util/validation'
import { requireSignedIn } from '../plugins/authPlugin'
load_env()

export default async function (fastify: FastifyInstance) {
    fastify.get('/@me', {
        preHandler: requireSignedIn
    }, async (req, res) => {
        const { user } = req

        res.send(clientSafeUser(user))
    })

    fastify.post<{
        Body: {
            username: string
            email: string
            usernameHasInit: boolean
            avatarUrl: string
        }
    }>('/edit', async (req, res) => {
        const { user } = req
        
        const { username, email, usernameHasInit, avatarUrl } = req.body

        if (!user) return res.status(401).send('Not logged in!')

        const $set = {} as any

        if (username) {
            if (!isValidUsername(username))
                return res.code(400).send({
                    message: 'That username is invalid',
                    error: 'USERNAME_INVALID',
                })

            $set.username = username
        }
        if (email) {
            if (!isValidEmail(email))
                return res.code(400).send({
                    message: 'That email is invalid',
                    error: 'EMAIL_INVALID',
                })

            const existing = (await getDocument('users', { email })) as User
            if (existing)
                return res.code(400).send({
                    message: 'That email is taken',
                    error: 'EMAIL_IN_USE',
                })

            $set.email = email
        }
        if (usernameHasInit) {
            if (!isValidBool(usernameHasInit))
                return res.code(400).send({
                    message: 'Field "usernameHasInit" should be boolean',
                    error: 'USERNAME_HAS_INIT_INVALID',
                })

            $set.usernameHasInit = usernameHasInit
        }
        if (avatarUrl) {
            if (!isValidHttpUrl(avatarUrl))
                return res.code(400).send({
                    message: 'Field "avatarUrl" should be a url',
                    error: 'AVATAR_URL_INVALID',
                })

            $set.avatarUrl = avatarUrl
        }

        await updateDocument(
            'users',
            { email: user.email },
            {
                $set,
            }
        )

        const updatedUser = (await getDocument('users', { email: email ?? user.email })) as User
        res.send(clientSafeUser(updatedUser))
    })

    fastify.post<{
        Body: {
            password: string
        }
    }>('/change_password', async (req, res) => {
        // TODO Add this
        res.code(400).send('NOT IMPLEMENTED')
    })
}
