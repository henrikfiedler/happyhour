import { getUserFromAuth, requireLogin } from '$lib/server/auth/user';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
    const user = requireLogin();

    const userData = await getUserFromAuth(user)

    if (!userData) {
        redirect(303, '/login')
    }

    return {
        userData
    };
}) satisfies PageServerLoad;