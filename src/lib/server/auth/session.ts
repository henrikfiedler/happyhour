import { sessionTable } from "../db/schema";
import type { User, Session } from "../db/schema";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "../db";
import { eq } from "drizzle-orm";
import type { RequestEvent } from "@sveltejs/kit";

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes);
    return token;
}

// export function createSession(token: string, userId: number, flags: SessionFlags): Session {
export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const [session] = await db.insert(sessionTable).values({
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }).returning()

    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const result = await db.query.sessionTable.findFirst({
        where: eq(sessionTable.id, sessionId),
        with: {
            user: true
        }
    });


    /* const row = db.queryOne(
        `
SELECT session.id, session.user_id, session.expires_at, session.two_factor_verified, user.id, user.email, user.username, user.email_verified, IIF(totp_credential.id IS NOT NULL, 1, 0), IIF(passkey_credential.id IS NOT NULL, 1, 0), IIF(security_key_credential.id IS NOT NULL, 1, 0) FROM session
INNER JOIN user ON session.user_id = user.id
LEFT JOIN totp_credential ON session.user_id = totp_credential.user_id
LEFT JOIN passkey_credential ON user.id = passkey_credential.user_id
LEFT JOIN security_key_credential ON user.id = security_key_credential.user_id
WHERE session.id = ?
`,
        [sessionId]
    ); */

    if (!result) {
        return { session: null, user: null };
    }

    const session: Session = {
        id: result.id,
        userId: result.user.id,
        expiresAt: result.expiresAt
    }

    const user: User = {
        id: result.user.id,
        email: result.user.email,
        passwordHash: result.user.passwordHash,
    }

    if (Date.now() >= session.expiresAt.getTime()) {
        invalidateSession(sessionId);

        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

        db.update(sessionTable)
            .set({ expiresAt: session.expiresAt })
            .where(eq(sessionTable.id, sessionId));


    }

    return { session, user };
}

export function invalidateSession(sessionId: string): void {
    db.delete(sessionTable).where(eq(sessionTable.id, sessionId));

}

export function invalidateUserSessions(userId: number): void {
    db.delete(sessionTable).where(eq(sessionTable.userId, userId));

}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiresAt
    });
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 0
    });
}