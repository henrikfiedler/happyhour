import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createUserVerificationRequest, getUserVerificationRequest, getVerificationRequest, sendVerificationRequest, triggerVerification, verifyUser } from '$lib/server/auth/email-verification';
import { getUserFromAuth } from '$lib/server/auth/user';

export const load = (async (event) => {
    if (!event.locals.user) {
        return redirect(303, '/login')
    }

    if (event.locals.user.emailVerified) {
        return redirect(303, '/targets')
    }

    const token = event.url.searchParams.get('token')

    const request = token ? await getVerificationRequest(token) : null

    if (request?.userId === event.locals.user.id) {
        await verifyUser(event.locals.user)

        return {
            userVerified: true
        }
    }

    const user = await getUserFromAuth(event.locals.user)

    if (!user) {
        return redirect(303, '/login')
    }

    return await triggerVerification(user)

}) satisfies PageServerLoad;

export const actions = {
    resend: async (event) => {
        if (!event.locals.user) {
            return redirect(303, '/login')
        }

        if (event.locals.user.emailVerified) {
            return redirect(303, '/targets')
        }

        const user = await getUserFromAuth(event.locals.user)

        if (!user) {
            return redirect(303, '/login')
        }

        const { currentRequest, newRequest } = await triggerVerification(user)

        if (currentRequest?.id) {
            await sendVerificationRequest(user.email, currentRequest.id)
        }

        return {
            resent: true
        }

    }
} satisfies Actions