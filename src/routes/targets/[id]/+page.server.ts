import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { targetTable, targetEntryTable } from '$lib/server/db/schema';
import { checkEntryEndDate, checkEntryStartDate, getEntriesByTarget } from '$lib/server/models/target-entry';
import { targetEntryInsertSchema } from '$lib/schemas';
import { fail, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const schema = targetEntryInsertSchema

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

    if (!target) {
        throw redirect(302, '/targets');
    }
    const form = await superValidate(zod(schema))

    const targetEntries = await getEntriesByTarget(target.id);

    return {
        form,
        target,
        targetEntries
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
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

        const startDateValid = await checkEntryStartDate(event.params.id, form.data.startDate);
        if (!startDateValid) {
            return setError(form, 'startDate', 'Start date may not be within the target date range or already exists.');
        }

        const endDateValid = await checkEntryEndDate(event.params.id, form.data.endDate);
        if (!endDateValid) {
            return setError(form, 'endDate', 'Ende date may not be within the target date range or already exists.');
        }

        const [targetEntry] = await db.insert(targetEntryTable)
            .values({
                targetId: event.params.id,
                ...form.data
            }).returning();

        if (!targetEntry) {
            return fail(400, {
                form,
            })
        }

        return {
            form
        }

    }
} satisfies Actions;