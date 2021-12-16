import { FastifyPluginAsync } from 'fastify'
import createPlugin from 'fastify-plugin'

declare module 'fastify' {
    interface FastifyReply {
        reply(message: string, statusCode?: number, data?: object, error?: string): FastifyReply
    }
}

// define options
export interface ReplyPluginOptions {

}

const replyPluginAsync: FastifyPluginAsync<ReplyPluginOptions> = async (fastify, options) => {
    fastify.decorateReply('reply', function (message: string, statusCode: number = 200, data?: object, error?: string) {
        this.code(statusCode)
        this.send({
            statusCode,
            message,
            error,
            data,
        })
    })
}

export default createPlugin(replyPluginAsync, {
    fastify: '3.x',
    name: 'cah-reply'
})