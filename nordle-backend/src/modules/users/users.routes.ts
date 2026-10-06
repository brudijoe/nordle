import type { FastifyPluginAsync } from 'fastify'
import { createUsersRepository } from './users.repository.ts'
import { createUsersService } from './users.service.ts'
import {
    createUserBody,
    updateUserBody,
    idParams,
    userResponse,
    userListResponse,
    type CreateUserBody,
    type UpdateUserBody,
    type IdParams,
} from './users.schema.ts'

const usersRoutes: FastifyPluginAsync = async (fastify) => {
    const service = createUsersService(createUsersRepository(fastify.db))

    fastify.get('/', { schema: { response: { 200: userListResponse } } }, () => service.list())

    fastify.get<{ Params: IdParams }>('/:id', { schema: { params: idParams, response: { 200: userResponse } } },
        (request) => service.getById(request.params.id),
    )

    // Invoke-RestMethod -Uri http://localhost:3000/users -Method Post -ContentType "application/json" -Body '{"email": "test@example.com", "name": "Testuser"}'
    fastify.post<{ Body: CreateUserBody }>('/', { schema: { body: createUserBody, response: { 201: userResponse } } },
        async (request, reply) => {
            const user = await service.create(request.body)
            return reply.code(201).send(user)
        },
    )

    fastify.patch<{ Params: IdParams; Body: UpdateUserBody }>('/:id', { schema: { params: idParams, body: updateUserBody, response: { 200: userResponse } } },
        (request) => service.update(request.params.id, request.body),
    )

    fastify.delete<{ Params: IdParams }>('/:id', { schema: { params: idParams } },
        async (request, reply) => {
            await service.remove(request.params.id)
            return reply.code(204).send()
        },
    )
}

export default usersRoutes