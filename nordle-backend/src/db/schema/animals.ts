import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const animals = pgTable('animals', {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
        startWith: 1000,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1
    }),
    animal: varchar({ length: 255 }).notNull().unique(),
});

export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;