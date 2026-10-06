import { pgTable, integer, text, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './shared.ts';

// Modern schema with identity columns (NEW STANDARD)
export const users = pgTable('users', {
    // Identity column - the new recommended approach
    id: integer('id').primaryKey().generatedAlwaysAsIdentity({
        startWith: 1000,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1
    }),
    email: varchar('email', { length: 320 }).notNull().unique(),
    name: text('name').notNull(),
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;