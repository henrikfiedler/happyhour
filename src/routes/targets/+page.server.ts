import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { targetInsertSchema } from '$lib/schemas';
import { targetTable, userTable } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { getTargetsByUserId } from '$lib/server/models/target';
import { eq, and } from 'drizzle-orm';
import { getUserFavoriteTargetId } from '$lib/server/models/user';
import { requireLogin } from '$lib/server/auth/user';


const schema = targetInsertSchema

export const load = (async (event) => {
    const user = requireLogin()

    const form = await superValidate(zod4(schema))

    return {
        user: event.locals.user,
        form,
        targets: await getTargetsByUserId(user.id),
        favoriteTargetId: await getUserFavoriteTargetId(user)
    };
}) satisfies PageServerLoad;

export const actions = {
    target: async (event) => {
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

        /* if (form.data.startDate > form.data.endDate) {
            setError(form, 'startDate', 'Start date must be before end date.');
            return setError(form, 'endDate', 'Start date must be before end date.');
        } */

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

    },
    favorite: async (event) => {
        if (event.locals.user === null) {
            return fail(401, {
                message: "Not authenticated"
            });
        }

        const data = await event.request.formData();
        const targetId = data.get('targetId')?.toString()

        targetId && await db.update(userTable)
            .set({
                favoriteTargetId: targetId
            })
            .where(eq(userTable.id, event.locals.user.id));

        return

    }
} satisfies Actions;