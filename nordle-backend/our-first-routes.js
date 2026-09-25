import { eq } from 'drizzle-orm'
import { animals } from './src/db/schema.ts'

// Schema-Validierung für den POST-Body
const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
        animal: { type: 'string' },
    },
}

const postAnimalSchema = {
    body: animalBodyJsonSchema,
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
    fastify.get('/animals', async (request, reply) => {
        const rows = await fastify.db.select().from(animals)
        if (rows.length === 0) throw new Error('No documents found')
        return rows
    })

    fastify.get('/animals/:animal', async (request, reply) => {
        const [row] = await fastify.db
            .select()
            .from(animals)
            .where(eq(animals.animal, request.params.animal))

        if (!row) throw new Error('Invalid value')
        return row
    })

    fastify.post('/animals', { schema: postAnimalSchema }, async (request, reply) => {
        const [row] = await fastify.db
            .insert(animals)
            .values({ animal: request.body.animal })
            .returning()

        reply.code(201)
        return row
    })
}

export default routes