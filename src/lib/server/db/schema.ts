import { pgTable, text, timestamp, serial, boolean, integer, char, uuid, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
	id: serial("id").primaryKey(),
	email: char('email', { length: 255 }).unique().notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", {
		withTimezone: true,
	}).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	}).notNull().defaultNow()
});

export const usersRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable),
	targets: many(targetTable)
}));

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
	}).notNull()
});

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	})
}));

export const targetTypeEnum = pgEnum('target_type', ['billableHours']);
export const targetUnitEnum = pgEnum('target_unit', ['hours']);

export const targetTable = pgTable("target", {
	id: uuid("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	startDate: timestamp("start_date", {
		withTimezone: true,
	}).notNull(),
	endDate: timestamp("end_date", {
		withTimezone: true,
	}).notNull(),
	targetType: targetTypeEnum("target_type").notNull().default('billableHours'),
	value: decimal("value").notNull(),
	targetUnit: targetUnitEnum("target_unit").notNull().default('hours'),
	createdAt: timestamp("created_at", {
		withTimezone: true,
	}).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	}).notNull().defaultNow()
});

export const targetRelations = relations(targetTable, ({ one }) => ({
	user: one(userTable, {
		fields: [targetTable.userId],
		references: [userTable.id]
	})
}));

export type DBUser = InferSelectModel<typeof userTable>;
export type DBSession = InferSelectModel<typeof sessionTable>;
export type DBTarget = InferSelectModel<typeof targetTable>;
