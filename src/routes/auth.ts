import { config as load_env } from 'dotenv'
import { FastifyInstance } from 'fastify'
import { OAuth2Client } from 'google-auth-library'
import DiscordOAuth2 from 'discord-oauth2'

import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-identicon-sprites'

import { getDocument, insertOne } from '../util/mongo.js'
import { clientSafeUser, User } from '../types/User.js'
import { isValidEmail, isValidPassword } from '../util/validation.js'
import { createRandomUsername } from '../util/random.js'
import { hash, validate } from '../util/passwords.js'
load_env()

export default async function (fastify: FastifyInstance) {
    const GOOGLE_OAUTH = new OAuth2Client(process.env.CLIENT_ID)
    const DISCORD_OAUTH = new DiscordOAuth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/login/callback',
    })

    fastify.delete('/logout', async (req, res) => {
        res.destroyJWT()

        res.send({
            message: 'Logged out successfully',
        })
    })

    fastify.post<{
        Body: {
            email: string
            password: string
        }
    }>('/login', async (req, res) => {
        const { email, password } = req.body

        const user = (await getDocument('users', { email })) as User

        if (!user || !validate(password, user.passwordHash))
            return res.code(400).send({
                message: 'The username and password combination was incorrect! Please try again',
                error: 'LOGIN_UNSUCCESSFUL',
            })

        res.setJWT({ user })
        res.code(200).send(clientSafeUser(user))
    })

    fastify.post<{
        Body: {
            email: string
            password: string
        }
    }>('/signup', async (req, res) => {
        const { email, password } = req.body

        if (!isValidEmail(email))
            return res.code(400).send({
                message: 'The email provided is not valid!',
                error: 'EMAIL_INVALID',
            })

        if (!isValidPassword(password))
            return res.code(400).send({
                message:
                    'The password provided is not valid! Must contain 8+ characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
                error: 'PASSWORD_INVALID',
            })

        const existing = (await getDocument('users', { email })) as User

        if (existing)
            return res.code(400).send({
                message: 'That email is already in use!',
                error: 'EMAIL_IN_USE',
            })

        let svgUrl = createAvatar(style, {
            seed: new Date().toJSON(),
            dataUri: true,
        })

        const user: User = {
            email: email,
            username: createRandomUsername(),
            avatarUrl: svgUrl,
            usernameHasInit: false,
            passwordHash: hash(password),
            isAdmin: false,
        }

        await insertOne('users', user)

        res.setJWT({ user })
        res.code(201).send(clientSafeUser(user))
    })

    fastify.post<{
        Body: {
            token: string
        }
    }>('/google', async (req, res) => {
        const { token } = req.body
        const ticket = await GOOGLE_OAUTH.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        })
        const { name, email, picture } = ticket.getPayload() ?? {}

        // If user is already in DB, jsut return the db stuff
        const existingUser = (await getDocument('users', { email })) as User

        if (existingUser) {
            res.setJWT({ user: existingUser })
            return res.send(clientSafeUser(existingUser))
        }

        // Insert User into DB

        if (!email) return res.code(400).send('Email was not recieved from provider')
        if (!name) return res.code(400).send('Username was not recieved from provider')
        if (!picture) return res.code(400).send('Avatar was not recieved from provider')

        const user: User = {
            email: email,
            username: name,
            avatarUrl: picture,
            usernameHasInit: false,
            passwordHash: null,
            isAdmin: false,
        }

        await insertOne('users', user)

        res.setJWT({ user })
        res.code(201).send(clientSafeUser(user))
    })

    fastify.post('/discord', async (req, res) => {
        const { code } = req.body as { code: string }

        if (!code) return res.code(400).send('Missing "code" query parameter')

        const { access_token } = await DISCORD_OAUTH.tokenRequest({
            code: code,
            scope: ['identify', 'email'],
            grantType: 'authorization_code',
        })

        const { id, username, email, avatar } = await DISCORD_OAUTH.getUser(access_token)

        // If user is already in DB, jsut return the db stuff
        const existingUser = (await getDocument('users', { email })) as User

        if (existingUser) {
            res.setJWT({ user: existingUser })
            return res.send(clientSafeUser(existingUser))
        }

        // Insert User into DB

        if (!id) return res.code(400).send('ID was not recieved from provider')
        if (!email) return res.code(400).send('Email was not recieved from provider')
        if (!username) return res.code(400).send('Username was not recieved from provider')
        if (!avatar) return res.code(400).send('Avatar was not recieved from provider')

        const user: User = {
            email: email,
            username: username,
            avatarUrl: `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
            usernameHasInit: false,
            passwordHash: null,
            isAdmin: false,
        }

        await insertOne('users', user)

        console.log('New User:', user)

        res.setJWT({ user })
        res.code(201).send(clientSafeUser(user))
    })
}
