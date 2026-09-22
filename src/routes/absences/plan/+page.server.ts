import { absenceEntryInsertSchema, absencePlanInsertSchema } from '$lib/schemas';
import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { requireLogin } from '$lib/server/auth/user';
import { createOrUpdateAbsencePlan, getAbsencePlansByYear, getAbsencePlanYears, getSelectPlanYears } from '$lib/server/models/absence-plan';
import { getAbsenceEntries, getAbsenceEntriesInDateRange } from '$lib/server/models/absence-entry';
import { absenceEntryTable } from '$lib/server/db/schema';
import { inArray, and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { z } from 'zod/v4';
import { z as zod3 } from 'zod'
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { getUserHolidayData } from '$lib/server/models/user';
import Holidays from 'date-holidays';

const schema = absencePlanInsertSchema

const aiSuggestionSchema = zod3.object({
    startDate: zod3.date(),
    endDate: zod3.date()
})

type PlanSchema = z.infer<typeof schema>;

const openai = createOpenAI({
    apiKey: OPENAI_API_KEY,
})

export const load = (async (event) => {
    const user = requireLogin()

    const selectedYearParam = event.url.searchParams.get('selectedYear')

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

    },
    createAISuggestion: async (event) => {
        const user = requireLogin()

        const selectedYear = 2025

        const holidayData = await getUserHolidayData(user)

        const holidays = (holidayData && holidayData.country && holidayData.state) ? new Holidays(
            {
                country: holidayData.country,
                state: holidayData.state,
                region: holidayData.region ?? undefined
            },
            { types: ['public'] }
        ).getHolidays().map(e => e.date.slice(0, 10)) : []


        const absencePlan = await getAbsencePlansByYear(user, selectedYear).then(value => value.filter(e => e.type === 'vacation')[0])

        const startDate = new Date(`${selectedYear}-01-01`)
        const endDate = new Date(`${selectedYear}-12-31`)

        const absenceEntries = await getAbsenceEntriesInDateRange(user, startDate, endDate)
            .then(value => value.filter(e => e.type === 'vacation')
            )

        const prompt = `Generate a vacation plan for the remaining holidays for the year ${selectedYear} with the following constraints:
            - The user has ${absencePlan.plannedDays} holidays in the year.
            - The user has the following holidays: ${holidays.join(', ')}.
            - The user has the following vacation entries: ${absenceEntries.map(e =>
            `${e.startDate.toISOString().slice(0, 10)} to ${e.endDate ? e.endDate.toISOString().slice(0, 10) : e.startDate.toISOString().slice(0, 10)}`).join(', ')}.
            `
        console.log("🚀 ~ prompt:", prompt)

        const data = await generateObject({
            model: openai('gpt-4o'),
            schema: aiSuggestionSchema,
            prompt: 'Generate a vacation plan for the year 2024 with the following constraints: \n'
        })
        
        console.log("🚀 ~ data:", data)

    }
} satisfies Actions;