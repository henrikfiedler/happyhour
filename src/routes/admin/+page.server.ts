import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import { userTable } from '$lib/server/db/schema';

export const load = (async (event) => {
    if ((!event.locals.user?.admin)) {
        return redirect(302, '/');
    }

    const users = await db.query.userTable.findMany({
        columns: {
            createdAt: true,
            email: true,
            emailVerified: true
        },
        orderBy: (userTable, { asc }) => asc(userTable.createdAt)
    })

    const dateExpr = sql<Date>`date(${userTable.createdAt})`;

    const cumulativeUserCountsRaw = await db.select({
        date: dateExpr.as('date'),
        cumulativeCount: sql<number>`COUNT(*) OVER (ORDER BY DATE(${userTable.createdAt}))`
    })
        .from(userTable)
        .groupBy(dateExpr)
        // .groupBy(userTable.createdAt)
        .orderBy(dateExpr);

    const cumulativeUserCounts = cumulativeUserCountsRaw.map(row => ({
        date: new Date(row.date),
        cumulativeCount: row.cumulativeCount
    }));

    return {
        users,
        cumulativeUserCounts
    };
}) satisfies PageServerLoad;