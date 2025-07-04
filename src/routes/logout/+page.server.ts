import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth/session';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        if (event.locals.session === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }
        invalidateSession(event.locals.session.id);
        deleteSessionTokenCookie(event);
        return redirect(302, "/login");
    }
} satisfies Actions;