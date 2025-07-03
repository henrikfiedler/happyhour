import type { AuthUser, PasswordForgot, User } from "$lib/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { passwordForgotTable, userTable } from "../db/schema";
import { sendMail } from "../email";
import { render } from "svelte/server";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { hashPassword } from "./password";
import PasswordForgotTemplate from "../email/components/password-forgot-template.svelte";

type TrigerReturnType = {
    currentRequest?: PasswordForgot,
    newRequest?: PasswordForgot
}

export async function triggerPasswordForgot(user: User): Promise<TrigerReturnType> {
    // Check, if a valid verification request still exists
    const currentRequest = await getUserPasswordForgot(user)

    if (currentRequest && Date.now() < currentRequest.expiresAt.getTime()) {
        return {
            currentRequest,
            newRequest: undefined
        }
    }

    // if not, create request in database
    const newRequest = await createUserPasswordForgot(user)
    // send request via email
    await sendPasswordForgot(user.email, newRequest.id)

    return {
        currentRequest: undefined,
        newRequest
    }

}

export async function setNewPassword(user: AuthUser, newPassword: string) {
    const passwordHash = await hashPassword(newPassword);
    return db.update(userTable).set({ passwordHash }).where(eq(userTable.id, user.id))
}

export async function getPasswordForgot(id: PasswordForgot['id']) {
    return db.query.passwordForgotTable.findFirst({ where: eq(passwordForgotTable.id, id) })
}

export async function getUserPasswordForgot(user: AuthUser) {
    return db.query.passwordForgotTable.findFirst({ where: eq(passwordForgotTable.userId, user.id) })
}

export async function createUserPasswordForgot(user: AuthUser) {
    await deleteUserPasswordForgot(user)

    const [request] = await db.insert(passwordForgotTable).values({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10)
    }).returning()

    return request
}

export async function deleteUserPasswordForgot(user: AuthUser) {
    return db.delete(passwordForgotTable).where(eq(passwordForgotTable.userId, user.id))
}

export async function sendPasswordForgot(to: User['email'], id: PasswordForgot['id']) {

    const { body } = render(PasswordForgotTemplate, {
        props: {
            token: id
        }
    });
    await sendMail({ to, subject: 'Passwort zurücksetzen', body })

    console.log('Your link to reset password is: ', `${PUBLIC_BASE_URL}/email-verification?token=${id}`)
}

