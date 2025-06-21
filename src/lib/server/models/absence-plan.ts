/* import { desc, asc, eq, and, gte, lte, or, type InferColumnsDataTypes, type InferSelectModel } from "drizzle-orm";
import { db } from "../db";
import { absencePlanTable, targetEntryTable, targetTable } from "../db/schema";
import type { AbsencePlan, AuthUser, OrderByType } from "$lib/types";
import { delay } from "$lib/utils";


export async function getAbsencePlanYears(user: AuthUser) {
    // await delay(3000)
    const years = await db.select({ year: absencePlanTable.year })
        .from(absencePlanTable)
        .where(eq(absencePlanTable.userId, user.id))
        .groupBy(absencePlanTable.year)
    return years.map(e => e.year)
}

export function getSelectPlanYears(years: Awaited<ReturnType<typeof getAbsencePlanYears>>) {
    const currentYear = new Date().getFullYear();
    const surroundingYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const allYears = Array.from(new Set([...years, ...surroundingYears])).sort((a, b) => a - b).map(e => e.toString());
    return allYears;
}

export async function getAbsencePlansByYear(user: AuthUser, year: AbsencePlan["year"]) {
    return await db.query.absencePlanTable.findMany({
        where: and(
            eq(absencePlanTable.year, year),
            eq(absencePlanTable.userId, user.id)
        )
    });
}

export async function createOrUpdateAbsencePlan(
    user: AuthUser,
    year: AbsencePlan["year"],
    vacationValue: AbsencePlan['plannedDays'],
    sickValue: AbsencePlan['plannedDays'],
    miscValue: AbsencePlan['plannedDays']) {

    await createOrUpdateValue(user, year, vacationValue, 'vacation')
    await createOrUpdateValue(user, year, sickValue, 'sick')
    await createOrUpdateValue(user, year, miscValue, 'misc')

}

async function createOrUpdateValue(user: AuthUser, year: AbsencePlan['year'], value: AbsencePlan['plannedDays'], type: AbsencePlan['type']) {
    const plan = await db.query.absencePlanTable.findFirst({
        where: and(
            eq(absencePlanTable.type, type),
            eq(absencePlanTable.year, year),
            eq(absencePlanTable.userId, user.id)
        )
    })

    plan ? await db.update(absencePlanTable)
        .set({
            plannedDays: value
        })
        .where(eq(absencePlanTable.id, plan.id))
        : await db.insert(absencePlanTable).values({
            userId: user.id,
            type,
            year,
            plannedDays: value,
        })
}

export async function getAbsencePlansInDateRange(user: AuthUser, startDate: Date, endDate: Date) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    return await db.query.absencePlanTable.findMany({
        where: and(
            eq(absencePlanTable.userId, user.id),
            gte(absencePlanTable.year, startYear),
            lte(absencePlanTable.year, endYear)
        ),
        orderBy: [desc(absencePlanTable.year)]
    });
} */