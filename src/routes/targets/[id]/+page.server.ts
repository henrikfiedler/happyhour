import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { targetTable, targetEntryTable } from '$lib/server/db/schema';
import { checkEntryEndDate, checkEntryStartDate, getEntriesByTarget } from '$lib/server/models/target-entry';
import { targetEntryInsertSchema } from '$lib/schemas';
import { getUserHolidayData } from '$lib/server/models/user';
import { requireLogin } from '$lib/server/auth/user';

const schema = targetEntryInsertSchema

export const load = (async (event) => {
    const user = requireLogin()

    if (event.params.id === undefined) {
        throw redirect(302, '/targets');
    }

    const target = await db.query.targetTable.findFirst({
        where: eq(targetTable.id, event.params.id),
    });

    if (!target) {
        throw redirect(302, '/targets');
    }

    const holidayData = await getUserHolidayData(user)

    const targetEntries = await getEntriesByTarget(target.id);

    return {
        // user: event.locals.user,
        holidayData,
        target,
        targetEntries
    };
}) satisfies PageServerLoad;
