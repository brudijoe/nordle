import { eq } from 'drizzle-orm'
import { animals } from './src/db/schema.ts'

/**
 * Response-Schema für ein einzelnes Animal-Objekt
 */
const animalProperties = {
    type: 'object',
    required: ['id', 'animal'],
    properties: {
        id: { type: 'integer' },
        animal: { type: 'string' },
    }
}

/**
 * GET /animals — Liste von Animals
 * @type {import('fastify').RouteShorthandOptions}
 */
const getAllOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: animalProperties
            }
        }
    }
}

/**
 * GET /animals/:animal — ein einzelnes Animal
 * @type {import('fastify').RouteShorthandOptions}
 */
const getByIdOpts = {
    schema: {
        params: {
            type: 'object',
            required: ['animal'],
            properties: {
                animal: { type: 'string' },
            },
        },
        response: {
            200: animalProperties
        }
    }
}

/**
 * Schema für POST /animals (hat einen Body)
 * @type {import('fastify').RouteShorthandOptions}
 */
const postOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['animal'],
            properties: {
                animal: { type: 'string' },
            },
        },
        response: {
            201: animalProperties
        }
    }
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
    fastify.get('/animals', getAllOpts, async (request, reply) => {
        const rows = await fastify.db.select().from(animals)
        if (rows.length === 0) throw new Error('No documents found')
        return rows
    })

    fastify.get('/animals/:animal', getByIdOpts, async (request, reply) => {
        const [row] = await fastify.db
            .select()
            .from(animals)
            .where(eq(animals.animal, request.params.animal))

        if (!row) throw new Error('Invalid value')
        return row
    })

    // Invoke post method from powershell
    // Invoke-RestMethod -Uri http://localhost:3000/animals -Method Post -ContentType "application/json" -Body '{"animal": "Hamster"}'
    fastify.post('/animals', postOpts, async (request, reply) => {
        const [row] = await fastify.db
            .insert(animals)
            .values({ animal: request.body.animal })
            .returning()

        reply.code(201)
        return row
    })
}

export default routes