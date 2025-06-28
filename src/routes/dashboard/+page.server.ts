import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { targetInsertSchema } from '$lib/schemas';
import { targetTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { getTargetsByUserId } from '$lib/server/models/target';
import { getUserFromAuth } from '$lib/server/auth/user';

const schema = targetInsertSchema

export const load = (async (event) => {
    if (event.locals.user === null) {
        throw redirect(302, '/login');
    }
    const user = await getUserFromAuth(event.locals.user);

    const form = await superValidate(zod4(schema))

    const targets = await getTargetsByUserId(event.locals.user.id);


    return {
        form,
        targets,
        user
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }
        const form = await superValidate(event, zod4(schema));

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        if (form.data.startDate > form.data.endDate) {
            setError(form, 'startDate', 'Start date must be before end date.');
            return setError(form, 'endDate', 'Start date must be before end date.');
        }

        const [target] = await db.insert(targetTable)
            .values({
                userId: event.locals.user.id,
                ...form.data
            }).returning();

        if (!target) {
            return fail(400, {
                form,
            })
        }

        return {
            form
        }

    }
} satisfies Actions;