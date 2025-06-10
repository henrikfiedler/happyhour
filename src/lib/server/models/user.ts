import { desc, asc, eq, and, getTableColumns } from "drizzle-orm";
import { db } from "../db";
import { targetTable, userTable } from "../db/schema";
import type { AuthUser, OrderByType } from "$lib/types";


export async function getUserHolidayData(user: AuthUser) {
    return db.query.userTable.findFirst({
        columns: {
            country: true,
            state: true,
            region: true
        },
        where: eq(userTable.id, user.id)
    })
}

export async function getUserFavoriteTargetId(user: AuthUser) {
    return db.query.userTable.findFirst({
        columns: {
            favoriteTargetId: true
        },
        where: eq(userTable.id, user.id)
    }).then(e => e?.favoriteTargetId ?? null)
}

export function getUserFavoriteTarget(user: AuthUser) {
    return db.selectDistinct({
        ...getTableColumns(targetTable)
    })
        .from(targetTable)
        .innerJoin(userTable, eq(targetTable.id, userTable.favoriteTargetId))
        .where(eq(targetTable.id, userTable.favoriteTargetId))
        .limit(1)
        .then(result => result[0])
}
