import { eq } from "drizzle-orm";
import { db } from "../db";
import { userTable } from "../db/schema";
import { hashPassword } from "./password";
import type { AuthUser, User } from "$lib/types";

import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export function requireLogin() {
    const { locals, url } = getRequestEvent();

    // assume `locals.user` is populated in `handle`
    if (!locals.user) {
        const redirectTo = url.pathname + url.search;
        const params = new URLSearchParams({ redirectTo });

        return redirect(307, `/login?${params}`);
    }

    if (!locals.user.emailVerified) {
        return redirect(307, `/email-verification`);
    }

    return locals.user;
}

export async function createUser(email: string, password: string) {
    const passwordHash = await hashPassword(password);

    const [user] = await db.insert(userTable).values({
        email,
        passwordHash,
    }).returning();
    /* const row = db.queryOne(
        "INSERT INTO user (email, username, password_hash, recovery_code) VALUES (?, ?, ?, ?) RETURNING user.id",
        [email, username, passwordHash, encryptedRecoveryCode]
    );
    if (row === null) {
        throw new Error("Unexpected error");
    }
    const user: User = {
        id: row.number(0),
        email,
        emailVerified: false,
        registeredTOTP: false,
        registeredPasskey: false,
        registeredSecurityKey: false,
        registered2FA: false
    }; */
    return user;
}

export async function getUserFromEmail(email: string) {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
    })
    return user;
}

export async function getUserFromId(id: User['id']) {
    return db.query.userTable.findFirst({
        where: eq(userTable.id, id),
    })

}

export async function getUserFromAuth(user: AuthUser) {
    return db.query.userTable.findFirst({
        where: eq(userTable.id, user.id),
    })

}