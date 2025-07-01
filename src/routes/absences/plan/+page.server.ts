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

const schema = absencePlanInsertSchema

type PlanSchema = z.infer<typeof schema>;



export const load = (async (event) => {
    const user = requireLogin()

    const selectedYearParam = event.url.searchParams.get('selectedYear')
    console.log("🚀 ~ load ~ selectedYearParam:", selectedYearParam)

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
    const form = await superValidate(absencePlan, zod4(schema))

    return {
        form,
        selectedYear,
        selectYears,
    };
}) satisfies PageServerLoad;

export const actions = {
    createPlan: async (event) => {
        // const user = requireLogin()
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

    }
} satisfies Actions;