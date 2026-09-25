import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const animals = pgTable('animals', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    animal: varchar({ length: 255 }).notNull().unique(),
})