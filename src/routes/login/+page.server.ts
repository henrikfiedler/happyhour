import type { PageServerLoad } from './$types';
import { superValidate, setError, fail } from 'sveltekit-superforms';
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from '@sveltejs/kit';
import { getUserFromEmail } from '$lib/server/auth/user';
import { verifyPasswordHash } from '$lib/server/auth/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth/session';
import { loginSchema } from '$lib/schemas';

const schema = loginSchema

export const load = (async (event) => {
    if (event.locals.user) {
        return redirect(303, '/targets');
    }

    return {
        form: await superValidate(event, zod4(schema)),
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod4(schema));

        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const user = await getUserFromEmail(form.data.email);

        /* if (!user) {
            return fail(400, {
                form,
                message: "Account does not exist"
            });
        } */

        const validPassword = user?.passwordHash ? await verifyPasswordHash(user.passwordHash, form.data.password) : false;
        if (!validPassword || !user?.id) {
            setError(form, 'email', '');
            return setError(form, 'password', 'Invalid password or e-mail.');
        }



        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);

        if (!user.emailVerified) {
            return redirect(303, '/email-verification')
        }

        return redirect(303, event.url.searchParams.get('redirectTo') ?? '/targets');
    },
};
