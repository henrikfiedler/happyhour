import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { workdayTable } from '../db/schema';
import type { AuthUser, Workday } from '$lib/types';

export async function getWorkdays(user: AuthUser, startDate?: Date, endDate?: Date) {
	const conditions = [eq(workdayTable.userId, user.id)];
	if (startDate) {
		conditions.push(sql`${workdayTable.date} >= ${toDateString(startDate)}::date`);
	}
	if (endDate) {
		conditions.push(sql`${workdayTable.date} <= ${toDateString(endDate)}::date`);
	}

	return db.query.workdayTable.findMany({
		where: and(...conditions),
		orderBy: [desc(workdayTable.date)]
	});
}

function toDateString(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export async function getWorkdaysInDateRange(user: AuthUser, startDate: Date, endDate: Date) {
	return getWorkdays(user, startDate, endDate);
}

/** Creates a workday if the user has not recorded that date yet. */
export async function createWorkday(
	user: AuthUser,
	workday: Pick<Workday, 'date' | 'type'>
) {
	const [createdWorkday] = await db.insert(workdayTable)
		.values({ userId: user.id, ...workday })
		.onConflictDoNothing({ target: [workdayTable.userId, workdayTable.date] })
		.returning();

	return createdWorkday ?? null;
}
