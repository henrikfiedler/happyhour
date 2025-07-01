import { absenceEntryInsertSchema, absencePlanInsertSchema } from '$lib/schemas';
import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { requireLogin } from '$lib/server/auth/user';
import { createOrUpdateAbsencePlan, getAbsencePlansByYear, getAbsencePlanYears, getSelectPlanYears } from '$lib/server/models/absence-plan';
import { getAbsenceEntries } from '$lib/server/models/absence-entry';
import { absenceEntryTable } from '$lib/server/db/schema';
import { inArray, and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { z } from 'zod/v4';

const schema = absenceEntryInsertSchema

export const load = (async (event) => {
    const user = requireLogin()

    const absenceEntries = await getAbsenceEntries(user)

    const form = await superValidate(zod4(schema))

    return {
        form,
        absenceEntries
    };
}) satisfies PageServerLoad;

export const actions = {
    createEntry: async (event) => {
        // const user = requireLogin()
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        const form = await superValidate(event, zod4(schema));
        console.log("🚀 ~ createEntry: ~ form:", form)

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        const [absenceEntry] = await db.insert(absenceEntryTable)
            .values({
                userId: event.locals.user.id,
                ...form.data
            }).returning();

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

        deleteIds && await db.delete(absenceEntryTable)
            .where(
                and(inArray(absenceEntryTable.id, deleteIds),
                    eq(absenceEntryTable.userId, event.locals.user.id))
            );

        return { success: true };
    }
} satisfies Actions;