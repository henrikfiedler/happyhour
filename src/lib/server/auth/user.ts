import { eq } from "drizzle-orm";
import { db } from "../db";
import { userTable, type User } from "../db/schema";
import { hashPassword } from "./password";


export async function createUser(email: string, password: string): Promise<User> {
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

export async function getUserFromEmail(email: string): Promise<User | undefined> {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
    })
    return user;
}