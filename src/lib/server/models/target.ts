import { desc, asc, eq, and } from "drizzle-orm";
import { db } from "../db";
import { targetTable } from "../db/schema";
import type { OrderByType } from "$lib/types";


export async function createTarget(
    userId: string,
    description: string,
    startDate: Date,
    endDate: Date,
    targetType: 'billableHours' = 'billableHours',
    targetValue: number,
    targetUnit: 'hours' = 'hours'
) {

    const result = await db.insert(targetTable)
        .values({
            userId,
            description,
            startDate,
            endDate,
            targetType,
            targetValue,
            targetUnit
        })
        .returning();

    return result
}

export async function getTargetsByUserId(userId: string, orderBy: OrderByType = 'desc') {
    return await db.query.targetTable.findMany({
        where: eq(targetTable.userId, userId),
        orderBy: orderBy === 'asc' ? [asc(targetTable.startDate)] : [desc(targetTable.startDate)],

    });
}

export async function getTarget(targetId: string, userId: string,) {
    return await db.query.targetTable.findFirst({
        where: and(
            eq(targetTable.id, targetId),
            eq(targetTable.userId, userId)
        ),
    });
}