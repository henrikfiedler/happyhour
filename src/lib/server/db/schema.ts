import { pgTable, text, timestamp, serial, boolean, date, integer, varchar, uuid, decimal, pgEnum, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", {
		withTimezone: true,
	}).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	}).notNull().defaultNow(),
	favoriteTargetId: uuid("favorite_target_id")
		.references((): AnyPgColumn => targetTable.id, { onDelete: 'set null' }),
	country: varchar("country", { length: 2 }),
	state: varchar("state", { length: 3 }),
	region: varchar("region", { length: 10 }),

});

export const usersRelations = relations(userTable, ({ many, one }) => ({
	sessions: many(sessionTable),
	targets: many(targetTable),
	favoriteTarget: one(targetTable, {
		fields: [userTable.favoriteTargetId],
		references: [targetTable.id],
		relationName: 'favoriteTarget'
	})
}));

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: uuid("user_id")
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
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => userTable.id),
	description: varchar("description", { length: 30 }).notNull(),
	startDate: date("start_date", { mode: "date" }).notNull(),
	endDate: date("end_date", { mode: "date" }).notNull(),
	targetType: targetTypeEnum("target_type").notNull().default('billableHours'),
	targetValue: real("target_value").notNull(),
	targetUnit: targetUnitEnum("target_unit").notNull().default('hours'),
	mondayIsWorkday: boolean("monday_is_workday").notNull().default(true),
	tuesdayIsWorkday: boolean("tuesday_is_workday").notNull().default(true),
	wednesdayIsWorkday: boolean("wednesday_is_workday").notNull().default(true),
	thursdayIsWorkday: boolean("thursday_is_workday").notNull().default(true),
	fridayIsWorkday: boolean("friday_is_workday").notNull().default(true),
	saturdayIsWorkday: boolean("saturday_is_workday").notNull().default(false),
	sundayIsWorkday: boolean("sunday_is_workday").notNull().default(false),
	createdAt: timestamp("created_at", {
		withTimezone: true,
	}).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	}).notNull().defaultNow()
});

export const targetRelations = relations(targetTable, ({ one, many }) => ({
	user: one(userTable, {
		fields: [targetTable.userId],
		references: [userTable.id]
	}),
	entries: many(targetEntryTable),
	favoriteTarget: one(userTable, {
		fields: [targetTable.id],
		references: [userTable.favoriteTargetId],
		relationName: 'favoriteTarget'
	})
}));

export const targetEntryTable = pgTable("target_entry", {
	id: uuid("id").primaryKey().defaultRandom(),
	targetId: uuid("target_id").notNull().references(() => targetTable.id),
	startDate: date("start_date", { mode: "date" }).notNull(),
	endDate: date("end_date", { mode: "date" }),
	entryValue: real("entry_value").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const targetEntryRelations = relations(targetEntryTable, ({ one, many }) => ({
	target: one(targetTable, {
		fields: [targetEntryTable.targetId],
		references: [targetTable.id]
	})
}));

export type DBUser = InferSelectModel<typeof userTable>;
export type DBSession = InferSelectModel<typeof sessionTable>;
export type DBTarget = InferSelectModel<typeof targetTable>;
export type DBTargetEntry = InferSelectModel<typeof targetEntryTable>;

export const targetInsertSchema = createInsertSchema(targetTable)