import fastifyPlugin from 'fastify-plugin'
import { drizzle } from 'drizzle-orm/node-postgres'
import { FastifyInstance } from 'fastify'

type Options = {
    connectionString: string;
}

const dbConnector = async (fastify: FastifyInstance, options: Options) => {
    const db = drizzle(options.connectionString);
    fastify.decorate('db', db)

    fastify.addHook('onClose', async () => {
        await db.$client.end()
    })
}

export default fastifyPlugin(dbConnector)