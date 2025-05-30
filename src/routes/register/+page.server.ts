import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from "sveltekit-superforms/adapters";
import { fail } from '@sveltejs/kit';


export const load = (async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        // const formData = await request.formData();
        const form = await superValidate(request, zod(formSchema));

        if (!form.valid) {
            return fail(400, {
                form,
            })
        }

        /* if (error) {
            return fail(400, {
                form
            }
            );
        } */

        return { form };
    },
};