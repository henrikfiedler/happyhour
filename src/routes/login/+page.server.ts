import type { PageServerLoad } from './$types';
import { superValidate, setError, fail } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from '@sveltejs/kit';
import { getUserFromEmail } from '$lib/server/auth/user';
import { verifyPasswordHash } from '$lib/server/auth/password';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth/session';

export const load = (async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));

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

        return redirect(303, '/targets');
    },
};
