import type { AbsenceEntry, HolidayData, Target, TargetEntry, TargetEntryComparison } from "./types";
import Holidays from 'date-holidays';


// Hilfsfunktion: Gibt alle Tage zwischen zwei Daten als Array von Date-Objekten zurück
function getDateRange(start: Date, end: Date | null): string[] {
    const dates: string[] = [];
    // Create UTC dates to avoid DST issues
    let current = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));

    if (!end) {
        return [getISODateString(current)];
    }

    const endDateUTC = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

    while (current <= endDateUTC) {
        dates.push(getISODateString(current));
        // Increment by exactly 24 hours in milliseconds
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }
    return dates;
}


function checkDateIsWorkday(date: Date, target: Target): boolean {
    const workday = date.getDay();

    switch (workday) {
        case 0:
            return target.sundayIsWorkday;
        case 1:
            return target.mondayIsWorkday;
        case 2:
            return target.tuesdayIsWorkday;
        case 3:
            return target.wednesdayIsWorkday;
        case 4:
            return target.thursdayIsWorkday;
        case 5:
            return target.fridayIsWorkday;
        case 6:
            return target.saturdayIsWorkday;
        default:
            return false; // Sollte nie erreicht werden
    }
}

function checkIsWorkday(date: Date, target: Target, holidayData: HolidayData | undefined, absenceEntries: AbsenceEntry[]): boolean {
    return checkDateIsWorkday(date, target) && !checkIsHoliday(date, holidayData) && !checkIsAbsence(date, absenceEntries);
}

/* function getTotalWorkdays(startDate: Date, endDate: Date): number {
    const days = getDateRange(startDate, endDate);
    return days.filter((date) => checkDateIsWorkday(new Date(date))).length;
}

function getTotalOffdays(startDate: Date, endDate: Date): number {
    const days = getDateRange(startDate, endDate);
    return days.filter((date) => !checkDateIsWorkday(new Date(date))).length;
} */



function checkIsHoliday(date: Date, holidayData: HolidayData | undefined): boolean {
    let hd =
        holidayData?.country && holidayData.state
            ? new Holidays(
                {
                    country: holidayData.country,
                    state: holidayData.state,
                    region: holidayData.region ?? undefined
                },
                { types: ['public'] }
            )
            : undefined;

    const holiday = hd?.isHoliday(date) ?? undefined;
    // return holiday ? holiday[0].type === 'public' : false;
    return !!holiday;
}

/* function getTotalHolidays(startDate: Date, endDate: Date): number {
    const days = getDateRange(startDate, endDate);
    return days.filter((date) => checkIsHoliday(new Date(date))).length;
} */

function checkIsAbsence(date: Date, absenceEntries: AbsenceEntry[]): boolean {
    const isoDate = getISODateString(date);
    return absenceEntries.some((entry) => {
        const start = getISODateString(entry.startDate);
        const end = entry.endDate ? getISODateString(entry.endDate) : start;
        return isoDate >= start && isoDate <= end;
    });
}

function getTotalAbsences(absenceEntries: AbsenceEntry[]): number {
    const absenceDays = new Set<string>();

    for (const entry of absenceEntries) {
        const daysInRange = getDateRange(entry.startDate, entry.endDate);
        for (const day of daysInRange) {
            absenceDays.add(day);
        }
    }

    return absenceDays.size;

    /* const days = getDateRange(startDate, endDate);
    return days.filter((date) => checkIsHoliday(new Date(date))).length; */
}

function getTotalNonWorkingDays(
    target: Target,
    absenceEntries: AbsenceEntry[],
    holidayData: HolidayData | undefined
    // absencePlans: AbsencePlan[]
): number {
    const nonWorkingDays = new Set<string>();

    const days = getDateRange(target.startDate, target.endDate);

    // Offdays
    for (const day of days.filter((date) => !checkIsWorkday(new Date(date), target, holidayData, absenceEntries))) {
        nonWorkingDays.add(day);
    }

    // Holidays
    for (const day of days.filter((date) => checkIsHoliday(new Date(date), holidayData))) {
        nonWorkingDays.add(day);
    }

    // Absences
    for (const entry of absenceEntries) {
        const daysInRange = getDateRange(entry.startDate, entry.endDate).filter((e) =>
            days.some((f) => f === e)
        );
        for (const day of daysInRange) {
            nonWorkingDays.add(day);
        }
    }

    // Planned Absences
    /* for (const plan of absencePlans) {
        const plannedTotalDays = plan.plannedDays ?? 0;
        const daysInPlanYear = days.filter((e) => new Date(e).getFullYear() === plan.year).length;
        const daysInYear = getDateRange(
            new Date(`${plan.year}-01-01`),
            new Date(`${plan.year}-12-31`)
        ).length;

        const plannedDays = Math.round(plannedTotalDays * (daysInPlanYear / daysInYear));

        // Zähle die tatsächlichen Absencetage dieses Typs im Jahr
        const actualDaysInYear = absenceEntries
            .filter((entry) => {
                const entryYearStart = entry.startDate.getFullYear();
                const entryYearEnd = entry.endDate ? entry.endDate.getFullYear() : entryYearStart;
                return (
                    entry.type === plan.type && (entryYearStart === plan.year || entryYearEnd === plan.year)
                );
            })
            .reduce((acc, entry) => {
                const daysInRange = getDateRange(entry.startDate, entry.endDate).filter((day) => {
                    const year = new Date(day).getFullYear();
                    return year === plan.year;
                });
                return acc + daysInRange.length;
            }, 0);

        const missingDays = plannedDays - actualDaysInYear;
        console.log('🚀 ~ missingDays:', missingDays);

        if (missingDays > 0) {
            // Füge fehlende geplante Tage als nicht-Arbeitstage hinzu
            const daysInYear = days.filter((date) => new Date(date).getFullYear() === plan.year);
            let added = 0;
            for (const day of daysInYear) {
                if (added >= missingDays) break;
                if (!nonWorkingDays.has(day)) {
                    nonWorkingDays.add(day);
                    added++;
                }
            }
        }
    } */

    return nonWorkingDays.size;

    /* const days = getDateRange(startDate, endDate);
    return days.filter((date) => checkIsHoliday(new Date(date))).length; */
}

function getISODateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function determineChartData(target: Target, targetEntries: TargetEntry[], absenceEntries: AbsenceEntry[], holidayData: HolidayData | undefined): { planPerDay: number; chartData: TargetEntryComparison[] } {
    const days = getDateRange(target.startDate, target.endDate);
    // const totalOffdays = getTotalOffdays(data.target.startDate, data.target.endDate);
    // const totalHolidays = getTotalHolidays(data.target.startDate, data.target.endDate);
    // const totalAbsences = getTotalAbsences(data.absenceEntries);
    const totalNonWorkingDays = getTotalNonWorkingDays(
        target,
        absenceEntries,
        holidayData
        // data.absencePlans
    );
    // const totalWorkdays = days.length - totalOffdays - totalHolidays - totalAbsences;
    const totalWorkdays = days.length - totalNonWorkingDays;
    const planPerDay = totalWorkdays > 0 ? target.targetValue / totalWorkdays : 0;

    let planSum = 0;
    let actualSum = 0;
    return {
        planPerDay,
        chartData: days.map((dateString, i) => {
            const date = new Date(dateString);

            planSum += checkIsWorkday(date, target, holidayData, absenceEntries) ? planPerDay : 0;

            const entry = targetEntries.find((entry) => {
                return entry.endDate
                    ? dateString >= getISODateString(entry.startDate) &&
                    dateString <= getISODateString(entry.endDate)
                    : dateString === getISODateString(entry.startDate);
            });

            const actualPerDay = entry
                ? entry.entryValue /
                /* getDateRange(entry.startDate, entry.endDate)
    .filter((e) => checkIsWorkday(new Date(e)))
    .length */
                getDateRange(entry.startDate, entry?.endDate).length
                : 0;

            actualSum += actualPerDay;
            const tommorrow = new Date(new Date());
            tommorrow.setHours(0, 0, 0, 0);
            tommorrow.setDate(tommorrow.getDate() + 1);
            return {
                date,
                planned: Math.round(planSum),
                actual: date <= tommorrow ? Math.round(actualSum) : null
            };
        })
    };
}

export { determineChartData, getISODateString }