import type { PageServerLoad, Actions } from './$types';
import { superValidate, fail } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/auth/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth/session';


export const load = (async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        // const formData = await request.formData();
        const form = await superValidate(event, zod(formSchema));

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        const user = await createUser(
            form.data.email,
            form.data.password
        );

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);

        return redirect(303, '/targets');
    },
} satisfies Actions;