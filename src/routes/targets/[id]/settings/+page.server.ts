import { db } from '$lib/server/db';
import { targetTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { targetUpdateSchema } from '$lib/schemas';

const schema = targetUpdateSchema

export const load = (async (event) => {
    if (event.locals.user === null) {
        throw redirect(302, '/login');
    }

    if (event.params.id === undefined) {
        throw redirect(302, '/targets');
    }

    const target = await db.query.targetTable.findFirst({
        where: eq(targetTable.id, event.params.id),
    });
    console.log("🚀 ~ load ~ target:", target)

    if (!target) {
        throw redirect(302, '/targets');
    }
    const form = await superValidate(target, zod(schema))


    return {
        form,
        target
    };
}) satisfies PageServerLoad;

export const actions = {
    target: async (event) => {
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }
        const form = await superValidate(event, zod(schema));

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        if (form.data.startDate > form.data.endDate) {
            setError(form, 'startDate', 'Start date must be before end date.');
            return setError(form, 'endDate', 'Start date must be before end date.');
        }

        const [target] = await db.update(targetTable)
            .set({
                id: undefined,
                userId: undefined,
                createdAt: undefined,
                ...form.data
            })
            .where(eq(targetTable.id, event.params.id))
            .returning();

        if (!target) {
            return fail(400, {
                form,
            })
        }

        console.log("🚀 ~ default: ~ form:", form)
        return {
            form
        }

    }
} satisfies Actions;