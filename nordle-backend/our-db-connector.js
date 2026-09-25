// ESM - dbConnector.js
import fastifyPlugin from 'fastify-plugin'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './src/db/schema.ts'

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function dbConnector(fastify, options) {
  const db = drizzle(options.connectionString, { schema })
  fastify.decorate('db', db)

  // Pool sauber schließen, wenn der Server runterfährt
  fastify.addHook('onClose', async () => {
    await db.$client.end()
  })
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(dbConnector)
