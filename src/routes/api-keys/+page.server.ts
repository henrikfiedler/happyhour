import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { apiKeyCreateSchema } from '$lib/schemas';
import { requireLogin } from '$lib/server/auth/user';
import { createApiKey, getApiKeys, revokeApiKeys } from '$lib/server/models/api-key';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const user = requireLogin();

	return {
		form: await superValidate(zod4(apiKeyCreateSchema)),
		apiKeys: await getApiKeys(user)
	};
}) satisfies PageServerLoad;

export const actions = {
	create: async (event) => {
		if (event.locals.user === null) {
			return fail(401, { message: 'Not authenticated' });
		}

		const form = await superValidate(event, zod4(apiKeyCreateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { key } = await createApiKey(event.locals.user, form.data.name);
		return message(form, key);
	},
	revokeSelected: async (event) => {
		if (event.locals.user === null) {
			return fail(401, { message: 'Not authenticated' });
		}

		const apiKeyIds = (await event.request.formData())
			.getAll('deleteId')
			.map((id) => id.toString());

		await revokeApiKeys(event.locals.user, apiKeyIds);
		return { success: true };
	}
} satisfies Actions;
