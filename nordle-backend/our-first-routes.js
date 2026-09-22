// our-first-routes.js

/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
const opts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: { type: 'string' }
                }
            }
        }
    }
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
    fastify.get('/', opts, async (request, reply) => {
        return { hello: 'world' }
    })
}

//ESM
export default routes;