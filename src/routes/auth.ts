import { config as load_env } from 'dotenv'
import { FastifyInstance } from 'fastify'
import { OAuth2Client } from 'google-auth-library'
import DiscordOAuth2 from 'discord-oauth2'

import { DB } from '../lib/mongodb/database'

load_env()

export default async function (fastify: FastifyInstance) {
    const GOOGLE_OAUTH = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const DISCORD_OAUTH = new DiscordOAuth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: `${process.env.CALLBACK_URL}/auth/callback/discord`,
    })

    fastify.delete('/logout', async (req, res) => {
        res.destroyJWT()

        res.send({
            message: 'Logged out successfully',
        })
    })

    // TODO Make this redirect back the login page with some sort of error
    // TODO Redirect to home page
    // TODO replace avatars with custom avatars that use @dicebear
    fastify.get('/callback/google', async (req, res) => {
        const { access_token } = await fastify.google.getAccessTokenFromAuthorizationCodeFlow(req)

        if (!access_token) return res.reply('Invalid token received from auth provider!', 400, {}, 'INVALID_ACCESS_TOKEN')

        const ticket = await GOOGLE_OAUTH.verifyIdToken({
            idToken: access_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const { name: username, email, picture: avatarUrl } = ticket.getPayload() ?? {}

        if (!(email && username && avatarUrl)) return res.reply('Missing data from OAuth provider', 400, {}, 'MISSING_OAUTH_DATA')

        // If user is already in DB, dont insert them again
        const existingUser = await DB.getUserFromEmail(email)

        if (existingUser) {
            res.setJWT({ userId: existingUser.id })
            return res.reply('User successfully authenticated!', 200, existingUser.toJSON())
        }

        // Insert User into DB
        const userId = await DB.insertUser({
            discordId: null,
            email,
            username,
            avatarUrl,
            isAdmin: false,
        })

        res.setJWT({ userId })
        res.reply('Created new user and authenticated!', 201, { userId })
    })

    fastify.get('/callback/discord', async (req, res) => {
        const { access_token } = await fastify.discord.getAccessTokenFromAuthorizationCodeFlow(req)

        if (!access_token) return res.reply('Invalid token received from auth provider!', 400, {}, 'INVALID_ACCESS_TOKEN')

        const { id: discordId, username, email, avatar: avatarHash } = await DISCORD_OAUTH.getUser(access_token)

        if (!(discordId && email && username && avatarHash)) return res.reply('Missing data from OAuth provider', 400, {}, 'MISSING_OAUTH_DATA')

        // If user is already in DB, dont insert them again
        const existingUser = await DB.getUserFromDiscordID(discordId) ?? await DB.getUserFromEmail(email)

        if (existingUser) {
            res.setJWT({ userId: existingUser.id })
            return res.reply('User successfully authenticated!', 200, existingUser.toJSON())
        }

        // Insert User into DB
        const userId = await DB.insertUser({
            discordId,
            email,
            username,
            avatarUrl: `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}`,
            isAdmin: false,
        })

        res.setJWT({ userId })
        res.reply('Created new user and authenticated!', 201, { userId })
    })
}
