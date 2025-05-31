import { getTargetsByUserId } from '$lib/server/models/target';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
    if (event.locals.user === null) {
        throw redirect(302, '/login');
    }

    const targets = await getTargetsByUserId(event.locals.user.id);

    return {
        targets
    };
}) satisfies PageServerLoad;