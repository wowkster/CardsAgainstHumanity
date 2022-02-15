import { config } from 'dotenv'
config()

import fastifyOauth2, { FastifyOAuth2Options } from 'fastify-oauth2'

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, CALLBACK_BASE_URL } = process.env

type OAuthOptions = FastifyOAuth2Options & {
    display: string
}

export const providers: OAuthOptions[] = [
    {
        name: 'google',
        display: 'Google',
        scope: ['email', 'identify'],
        credentials: {
            client: {
                id: GOOGLE_CLIENT_ID!,
                secret: GOOGLE_CLIENT_SECRET!
            },
            auth: fastifyOauth2.GOOGLE_CONFIGURATION
        },
        // register a fastify url to start the redirect flow
        startRedirectPath: '/login/provider/google',
        // facebook redirect here after the user login
        callbackUri: `${CALLBACK_BASE_URL}/auth/callback/google`
    },
    {
        name: 'github',
        display: 'GitHub',
        scope: ['email', 'identify'],
        credentials: {
            client: {
                id: GITHUB_CLIENT_ID!,
                secret: GITHUB_CLIENT_SECRET!
            },
            auth: fastifyOauth2.GITHUB_CONFIGURATION
        },
        // register a fastify url to start the redirect flow
        startRedirectPath: '/login/provider/github',
        // facebook redirect here after the user login
        callbackUri: `${CALLBACK_BASE_URL}/auth/callback/github`
    },
    {
        name: 'discord',
        display: 'Discord',
        scope: ['email', 'identify'],
        credentials: {
            client: {
                id: DISCORD_CLIENT_ID!,
                secret: DISCORD_CLIENT_SECRET!
            },
            auth: fastifyOauth2.DISCORD_CONFIGURATION
        },
        // register a fastify url to start the redirect flow
        startRedirectPath: '/login/provider/discord',
        // facebook redirect here after the user login
        callbackUri: `${CALLBACK_BASE_URL}/auth/callback/discord`
    }
]
