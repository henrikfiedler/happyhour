import type { PageServerLoad, Actions } from './$types';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/auth/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth/session';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { registerSchema } from '$lib/schemas';


export const load = (async () => {
    return {
        form: await superValidate(zod(registerSchema)),
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        // const formData = await request.formData();
        const form = await superValidate(event, zod(registerSchema));
        console.log("🚀 ~ default: ~ form:", form)

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        const checkEmail = await db.query.userTable.findFirst({
            where: eq(userTable.email, form.data.email)
        })

        if (checkEmail) {
            return setError(form, 'email', 'Email already taken.')
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