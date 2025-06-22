import type { AuthUser, EmailVerification, User } from "$lib/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { emailVerificationTable, userTable } from "../db/schema";
import { sendMail } from "../email";
import { render } from "svelte/server";
import EmailVerificationTemplate from "../email/components/email-verification-template.svelte";
import { PUBLIC_BASE_URL } from "$env/static/public";

type TrigerReturnType = {
    currentRequest?: EmailVerification,
    newRequest?: EmailVerification
}

export async function triggerVerification(user: User): Promise<TrigerReturnType> {
    // Check, if a valid verification request still exists
    const currentRequest = await getUserVerificationRequest(user)

    if (currentRequest && Date.now() < currentRequest.expiresAt.getTime()) {
        return {
            currentRequest,
            newRequest: undefined
        }
    }

    // if not, create request in database
    const newRequest = await createUserVerificationRequest(user)
    // send request via email
    await sendVerificationRequest(user.email, newRequest.id)

    return {
        currentRequest: undefined,
        newRequest
    }

}

export async function verifyUser(user: AuthUser) {
    return db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, user.id))
}

export async function getVerificationRequest(id: EmailVerification['id']) {
    return db.query.emailVerificationTable.findFirst({ where: eq(emailVerificationTable.id, id) })
}

export async function getUserVerificationRequest(user: AuthUser) {
    return db.query.emailVerificationTable.findFirst({ where: eq(emailVerificationTable.userId, user.id) })
}

export async function createUserVerificationRequest(user: AuthUser) {
    await deleteUserVerificationRequest(user)

    const [verification] = await db.insert(emailVerificationTable).values({
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10)
    }).returning()

    return verification
}

export async function deleteUserVerificationRequest(user: AuthUser) {
    return db.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, user.id))
}

export async function sendVerificationRequest(to: User['email'], id: EmailVerification['id']) {

    const { body } = render(EmailVerificationTemplate, {
        props: {
            token: id
        }
    });
    await sendMail({ to, subject: 'E-Mail-Verifizierung', body })

    console.log('Your link to verify e-mail is: ', `${PUBLIC_BASE_URL}/email-verification?token=${id}`)
}

