import type { UsersRepository } from './users.repository.ts'
import type { CreateUserBody, UpdateUserBody } from './users.schema.ts'

export function createUsersService(repo: UsersRepository) {
    return {
        list: () => repo.findAll(),

        async getById(id: number) {
            const user = await repo.findById(id)
            if (!user) throw new Error('User not found')
            return user
        },

        async create(input: CreateUserBody) {
            const user = await repo.create(input)
            if (!user) throw new Error('Email already in use')
            return user
        },

        async update(id: number, input: UpdateUserBody) {
            const user = await repo.update(id, input)
            if (!user) throw new Error('User not found')
            return user
        },

        async remove(id: number) {
            const deleted = await repo.remove(id)
            if (!deleted) throw new Error('User not found')
        },
    }
}