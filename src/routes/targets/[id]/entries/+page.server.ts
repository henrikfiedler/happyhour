import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { eq, and, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { targetTable, targetEntryTable } from '$lib/server/db/schema';
import { checkEntryEndDate, checkEntryInRange, checkEntryStartDate, getEntriesByTarget } from '$lib/server/models/target-entry';
import { targetEntryInsertSchema } from '$lib/schemas';
import { fail, superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { requireLogin } from '$lib/server/auth/user';
import { delay } from '$lib/utils';

const schema = targetEntryInsertSchema

export const load = (async (event) => {
    const user = requireLogin()

    if (event.params.id === undefined) {
        throw redirect(302, '/targets');
    }

    const target = await db.query.targetTable.findFirst({
        where: eq(targetTable.id, event.params.id),
    });

    if (!target) {
        throw redirect(302, '/targets');
    } else if (target.userId !== user.id) {
        throw error(403, { message: 'Unauthorized' })
    }


    const form = await superValidate(zod4(schema))


    return {
        form,
        target,
        targetEntries: await getEntriesByTarget(event.params.id)
    };
}) satisfies PageServerLoad;

export const actions = {
    create: async (event) => {
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

        if (form.data.endDate && form.data.startDate > form.data.endDate) {
            setError(form, 'startDate', 'Startdatum muss vor dem Enddatum liegen.');
            return setError(form, 'endDate', 'Startdatum muss vor dem Enddatum liegen.');
        }

        const startDateValid = await checkEntryStartDate(event.params.id, form.data.startDate);
        if (!startDateValid) {
            return setError(form, 'startDate', 'Startdatum darf nicht außerhalb des Zielzeitraums liegen oder existiert bereits.');
        }

        const endDateValid = form.data.endDate ? await checkEntryEndDate(event.params.id, form.data.endDate) : true;
        if (!endDateValid) {
            return setError(form, 'endDate', 'Enddatum darf nicht außerhalb des Zielzeitraums liegen oder existiert bereits.');
        }

        const rangeValid = form.data.endDate ? await checkEntryInRange(event.params.id, form.data.startDate, form.data.endDate) : true
        if (!rangeValid) {
            setError(form, 'startDate', 'Startdatum darf nicht außerhalb des Zielzeitraums liegen oder existiert bereits.');
            return setError(form, 'endDate', 'Enddatum darf nicht außerhalb des Zielzeitraums liegen oder existiert bereits.');
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

    },
    deleteSelected: async (event) => {
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        const data = await event.request.formData();
        const deleteIds = data.getAll('deleteId').map(e => e.toString())

        // await delay(3000)

        deleteIds && await db.delete(targetEntryTable)
            .where(
                and(inArray(targetEntryTable.id, deleteIds),
                    eq(targetEntryTable.targetId, event.params.id))
            );

        return { success: true };
    }
} satisfies Actions;