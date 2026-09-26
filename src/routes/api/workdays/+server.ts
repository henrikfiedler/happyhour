import { json } from '@sveltejs/kit';
import { workdayInsertSchema } from '$lib/schemas';
import { validateApiKey } from '$lib/server/models/api-key';
import { createWorkday } from '$lib/server/models/workday';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const authorization = request.headers.get('authorization');
	const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
	const user = authorization
		? bearerToken ? await validateApiKey(bearerToken) : null
		: locals.user;

	if (user === null) {
		return json({ message: 'Not authenticated' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Request body must be valid JSON' }, { status: 400 });
	}

	const parsed = workdayInsertSchema.safeParse(body);
	if (!parsed.success) {
		return json({ message: 'Invalid workday', issues: parsed.error.issues }, { status: 400 });
	}

	const workday = await createWorkday(user, parsed.data);
	if (workday === null) {
		return json({ message: 'A workday for this date already exists' }, { status: 409 });
	}

	return json({ workday }, { status: 201 });
};
