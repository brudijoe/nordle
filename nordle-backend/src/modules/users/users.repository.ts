import { eq } from 'drizzle-orm'
import { users, type NewUser } from '../../../src/db/schema/users.ts'

// TODO typing
export function createUsersRepository(db: any) {
    return {
        findAll: () => db.select().from(users),

        async findById(id: number) {
            const [user] = await db.select().from(users).where(eq(users.id, id))
            return user ?? null
        },

        // null, wenn die E-Mail schon existiert
        async create(data: Pick<NewUser, 'email' | 'name'>) {
            const [user] = await db
                .insert(users)
                .values(data)
                .onConflictDoNothing({ target: users.email })
                .returning()
            return user ?? null
        },

        async update(id: number, data: Pick<NewUser, 'name'>) {
            const [user] = await db
                .update(users)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(users.id, id))
                .returning()
            return user ?? null
        },

        async remove(id: number) {
            const rows = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })
            return rows.length > 0
        },
    }
}

export type UsersRepository = ReturnType<typeof createUsersRepository>