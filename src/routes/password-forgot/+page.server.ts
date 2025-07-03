import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getPasswordForgot, setNewPassword, triggerPasswordForgot } from '$lib/server/auth/password-forgot'
import { forgotPasswortRequestSchema, forgotPasswortSubmitSchema } from '$lib/schemas';
import { fail, formFieldProxy, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getUserFromAuth, getUserFromEmail, getUserFromId } from '$lib/server/auth/user';


export const load = (async (event) => {
    if (event.locals.user) {
        return redirect(303, '/targets')
    }

    const token = event.url.searchParams.get('token')

    const request = token ? await getPasswordForgot(token) : null

    const validToken = request ? true : false

    const requestForm = await superValidate(event, zod4(forgotPasswortRequestSchema));
    const submitForm = await superValidate(event, zod4(forgotPasswortSubmitSchema));

    if (token) {
        submitForm.data.token = token
    }

    return {
        requestForm,
        submitForm,
        validToken
    }

}) satisfies PageServerLoad;

export const actions = {
    request: async (event) => {
        const requestForm = await superValidate(event, zod4(forgotPasswortRequestSchema));

        if (!requestForm.valid) {
            return fail(400, {
                requestForm
            });
        }

        const user = await getUserFromEmail(requestForm.data.email)

        if (user) {
            await triggerPasswordForgot(user)
        }

        return message(requestForm, { email: requestForm.data.email })
    },
    submit: async (event) => {
        const submitForm = await superValidate(event, zod4(forgotPasswortSubmitSchema));

        if (!submitForm.valid) {
            return fail(400, {
                submitForm
            });
        }

        const request = await getPasswordForgot(submitForm.data.token)
        if (!request) {
            return fail(400, {
                submitForm
            });
        }
        const user = await getUserFromId(request.userId)

        if (!user) {
            return fail(400, {
                submitForm
            });
        }

        await setNewPassword(user, submitForm.data.password)

        return redirect(303, '/login')
    }
} satisfies Actions
