import { getTarget, getTargetsByUserId } from '$lib/server/models/target';
import { getUserFavoriteTarget } from '$lib/server/models/user';
import type { LayoutServerLoad } from './$types';

function checkTargetRoute(url: URL) {
    if (!url.pathname.startsWith('/targets')) {
        return undefined;
    }
    if (!url.pathname.split('/')[2]) {
        return undefined
    }

    return url.pathname.split('/')[2]
}

export const load = (async (event) => {
    const url = event.url;

    const currentTargetId = checkTargetRoute(url);

    const currentTarget = (event.locals.user) && currentTargetId ?
        await getTarget(currentTargetId, event.locals.user.id)
        : event.locals.user ?
            await getUserFavoriteTarget(event.locals.user)
            : undefined;

    console.log("🚀 ~ load ~ currentTarget:", currentTarget)
    return {
        user: event.locals.user,
        currentTarget
    };
}) satisfies LayoutServerLoad;