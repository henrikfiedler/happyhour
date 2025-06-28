import { absenceEntryInsertSchema } from '$lib/schemas';
import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { requireLogin } from '$lib/server/auth/user';
// import { createOrUpdateAbsencePlan, getAbsencePlansByYear, getAbsencePlanYears, getSelectPlanYears } from '$lib/server/models/absence-plan';
import { getAbsenceEntries } from '$lib/server/models/absence-entry';
import { absenceEntryTable } from '$lib/server/db/schema';
import { inArray, and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';

// const planSchema = absencePlanInsertSchema
const entrySchema = absenceEntryInsertSchema

// type PlanSchema = z.infer<typeof planSchema>;

export const load = (async (event) => {

    const user = requireLogin()

    /* const selectedYearParam = event.url.searchParams.get('selectedYear')

    let selectedYear = selectedYearParam ? new Date(selectedYearParam) : new Date()

    const absencePlanYears = await getAbsencePlanYears(user)
    const selectYears = getSelectPlanYears(absencePlanYears)

    const planData = await getAbsencePlansByYear(user, selectedYear.getFullYear())

    const absencePlan: PlanSchema = {
        year: selectedYear.getFullYear(),
        vacationValue: planData.find(e => e.type === 'vacation')?.plannedDays ?? 0,
        sickValue: planData.find(e => e.type === 'sick')?.plannedDays ?? 0,
        miscValue: planData.find(e => e.type === 'misc')?.plannedDays ?? 0
    }
   const planForm = await superValidate(absencePlan, zod44(planSchema)) */

    const absenceEntries = await getAbsenceEntries(user)

    const entryForm = await superValidate(zod4(entrySchema))


    return {
        // planForm,
        // selectedYear,
        // selectYears,
        entryForm,
        absenceEntries
    };
}) satisfies PageServerLoad;

export const actions = {
    /* createPlan: async (event) => {
        // const user = requireLogin()
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        const form = await superValidate(event, zod44(planSchema));
        console.log("🚀 ~ createPlan: ~ form:", form)

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        await createOrUpdateAbsencePlan(
            event.locals.user,
            form.data.year,
            form.data.vacationValue,
            form.data.sickValue,
            form.data.miscValue
        )

        return {
            form
        }

    }, */
    createEntry: async (event) => {
        // const user = requireLogin()
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        const form = await superValidate(event, zod4(entrySchema));
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