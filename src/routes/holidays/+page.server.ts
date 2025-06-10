import type { Actions, PageServerLoad } from './$types';
import { requireLogin } from '$lib/server/auth/user';
import { holidaySchema } from '$lib/schemas';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod, } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getUserHolidayData } from '$lib/server/models/user';

const schema = holidaySchema

type HolidaySchema = z.infer<typeof schema>;


export const load = (async (event) => {
    const user = requireLogin()

    const holidayData = await getUserHolidayData(user)

    const userHolidays: HolidaySchema = {
        country: holidayData?.country ?? undefined,
        state: holidayData?.state ?? undefined,
        region: holidayData?.region ?? undefined
    }

    const form = await superValidate(userHolidays, zod(schema));

    return {
        form,
        user
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        const user = requireLogin()

        const form = await superValidate(event, zod(schema));

        if (!form.valid) {
            return fail(400)
        }

        await db.update(userTable).set({
            country: form.data.country ?? null,
            state: form.data.state ?? null,
            region: form.data.region ?? null
        }).where(eq(userTable.id, user.id))

        return {
            form
        }

    }
} satisfies Actions;