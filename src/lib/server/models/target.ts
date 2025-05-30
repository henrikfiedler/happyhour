import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { targetTable } from "../db/schema";


export async function createTarget(
    userId: string,
    startDate: Date,
    endDate: Date,
    targetType: 'billableHours' = 'billableHours',
    targetValue: number,
    targetUnit: 'hours' = 'hours'
) {

    const result = await db.insert(targetTable)
        .values({
            userId,
            startDate,
            endDate,
            targetType,
            targetValue,
            targetUnit
        })
        .returning();

    return result
}

export async function getTargetsByUserId(userId: string) {
    return await db.query.targetTable.findMany({
        where: eq(targetTable.userId, userId),
        orderBy: [desc(targetTable.startDate)]
    });
}