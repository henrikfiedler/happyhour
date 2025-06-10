import { desc, asc, eq, and, gte, lte, or } from "drizzle-orm";
import { db } from "../db";
import { targetEntryTable, targetTable } from "../db/schema";
import type { OrderByType } from "$lib/types";
import { delay } from "$lib/utils";

export async function getEntriesByTarget(targetId: string, orderBy: OrderByType = 'desc') {
    // await delay(3000)
    return await db.query.targetEntryTable.findMany({
        where: eq(targetEntryTable.targetId, targetId),
        orderBy: orderBy === 'asc' ? [asc(targetEntryTable.startDate)] : [desc(targetEntryTable.startDate)]
    });
}

export async function checkEntryStartDate(targetId: string, startDate: Date) {
    console.log("🚀 ~ checkEntryStartDate ~ startDate:", startDate)
    const target = await db.query.targetTable.findFirst({
        where: eq(targetTable.id, targetId)
    });
    console.log("🚀 ~ checkEntryStartDate ~ target:", target)

    if (!target || target.startDate > startDate || target.endDate < startDate) {
        return false;
    }

    const entries = await db.query.targetEntryTable.findMany({
        where: and(
            eq(targetEntryTable.targetId, targetId),
            or(and(lte(targetEntryTable.startDate, startDate),
                gte(targetEntryTable.endDate, startDate)),
                eq(targetEntryTable.startDate, startDate) // Check if an entry starts exactly at the startDate
            )
        ),
        limit: 1
    });

    if (entries.length > 0) return false;

    return true
}

export async function checkEntryEndDate(targetId: string, endDate: Date) {
    const target = await db.query.targetTable.findFirst({
        where: eq(targetTable.id, targetId)
    });

    if (!target || target.startDate > endDate || target.endDate < endDate) {
        return false;
    }

    const entries = await db.query.targetEntryTable.findMany({
        where: and(
            eq(targetEntryTable.targetId, targetId),
            lte(targetEntryTable.startDate, endDate),
            gte(targetEntryTable.endDate, endDate)
        ),
        limit: 1
    });

    if (entries.length > 0) return false;

    return true
}