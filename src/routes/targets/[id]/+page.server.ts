import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { targetTable } from '$lib/server/db/schema';

export const load = (async (event) => {
    if (event.locals.user === null) {
        throw redirect(302, '/login');
    }

    if (event.params.id === undefined) {
        throw redirect(302, '/targets');
    }

    const target = await db.query.targetTable.findFirst({
        where: eq(targetTable.id, event.params.id),
    });

    return {
        target
    };
}) satisfies PageServerLoad;