import { desc, asc, eq, and, gte, lte, or, type InferColumnsDataTypes, type InferSelectModel, isNull } from "drizzle-orm";
import { db } from "../db";
import { absenceEntryTable } from "../db/schema";
import type { AuthUser, OrderByType } from "$lib/types";
import { delay } from "$lib/utils";


export async function getAbsenceEntries(user: AuthUser) {
    // await delay(3000)
    return db.query.absenceEntryTable.findMany({
        where: eq(absenceEntryTable.userId, user.id),
        orderBy: [desc(absenceEntryTable.startDate)]
    })
}

export async function getAbsenceEntriesInDateRange(user: AuthUser, startDate: Date, endDate: Date) {
    return db.query.absenceEntryTable.findMany({
        where: and(
            eq(absenceEntryTable.userId, user.id),
            lte(absenceEntryTable.startDate, endDate),
            or(
                gte(absenceEntryTable.endDate, startDate),
                isNull(absenceEntryTable.endDate)
            )
        ),
        orderBy: [desc(absenceEntryTable.startDate)]
    })
}