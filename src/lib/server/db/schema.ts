import { pgTable, text, timestamp, serial, boolean, integer, char } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
	id: serial("id").primaryKey(),
	email: char('email', { length: 255 }).unique().notNull(),
	passwordHash: text("password_hash").notNull(),
});

export const usersRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable),
	// portfolios: many(portfolioTable)
}));

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	})
}));

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
