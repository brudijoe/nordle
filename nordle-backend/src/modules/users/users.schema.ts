import type { NewUser } from '../../../src/db/schema/users';

export type CreateUserBody = Pick<NewUser, 'email' | 'name'>
export type UpdateUserBody = Pick<NewUser, 'name'>
export interface IdParams {
    id: number
}

export const idParams = {
    type: 'object',
    properties: { id: { type: 'integer' } },
    required: ['id'],
} as const

export const createUserBody = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email', maxLength: 320 },
        name: { type: 'string', minLength: 1 },
    },
    required: ['email', 'name'],
    additionalProperties: false,
} as const

export const updateUserBody = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1 },
    },
    required: ['name'],
    additionalProperties: false,
} as const

export const userResponse = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
} as const

export const userListResponse = {
    type: 'array',
    items: userResponse,
} as const