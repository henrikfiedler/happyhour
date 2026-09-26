import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { workdayInsertSchema } from '$lib/schemas';
import { requireLogin } from '$lib/server/auth/user';
import { createWorkday, getWorkdays } from '$lib/server/models/workday';
import { db } from '$lib/server/db';
import { workdayTable } from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import type { WorkdayType } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

function parseDateParam(value: string | null) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export const load = (async ({ url }) => {
    const user = requireLogin();
    const form = await superValidate({ date: new Date(), type: 'office' }, zod4(workdayInsertSchema));
    const fromParam = url.searchParams.get('from');
    const toParam = url.searchParams.get('to');
    const hasFilterParams = fromParam !== null || toParam !== null;
    const currentYear = new Date().getFullYear();
    const defaultFrom = `${currentYear}-01-01`;
    const defaultTo = `${currentYear}-12-31`;
    const from = hasFilterParams ? fromParam ?? '' : defaultFrom;
    const to = hasFilterParams ? toParam ?? '' : defaultTo;
    const workdays = await getWorkdays(user, parseDateParam(from), parseDateParam(to));
    const workdayCounts: Record<WorkdayType, number> = {
        office: 0,
        homeOffice: 0,
        customer: 0
    };

    for (const workday of workdays) {
        workdayCounts[workday.type]++;
    }

    return {
        form,
        workdays,
        filters: { from, to },
        workdayCounts
    };
}) satisfies PageServerLoad;

export const actions = {
    save: async (event) => {
        if (event.locals.user === null) {
            return fail(401, { message: 'Not authenticated' });
        }

        const form = await superValidate(event, zod4(workdayInsertSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const workday = await createWorkday(event.locals.user, form.data);
        if (workday === null) {
            return setError(form, 'date', 'Für diesen Tag ist bereits ein Arbeitstag erfasst.');
        }

        return { form };
    },
    deleteSelected: async (event) => {
        if (event.locals.user === null) {
            return fail(401, { message: 'Not authenticated' });
        }

        const deleteIds = (await event.request.formData())
            .getAll('deleteId')
            .map((id) => id.toString());

        if (deleteIds.length > 0) {
            await db.delete(workdayTable).where(and(
                inArray(workdayTable.id, deleteIds),
                eq(workdayTable.userId, event.locals.user.id)
            ));
        }

        return { success: true };
    }
} satisfies Actions;
