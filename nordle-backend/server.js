// ESM
import Fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import routes from './our-first-routes.js'
import dbConnector from './our-db-connector.js'

const fastify = Fastify({
    logger: true
})

const schema = {
    type: 'object',
    required: ['DATABASE_URL'],
    properties: {
        DATABASE_URL: { type: 'string' }
    }
}

/**
 * Run the server!
 */
const start = async () => {
    try {
        await fastify.register(fastifyEnv, { schema: schema, dotenv: true })
        await fastify.register(dbConnector, { connectionString: fastify.config.DATABASE_URL })
        await fastify.register(routes)
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
