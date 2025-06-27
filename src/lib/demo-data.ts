import type { Target, TargetEntry, AbsenceEntry } from '$lib/types';

// Hilfsfunktionen für dynamische Datumsberechnung
export function getFirstDayOfPreviousMonth(date: Date) {
    const d = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return d;
}
export function getLastDayOfThirdMonth(date: Date) {
    const d = new Date(date.getFullYear(), date.getMonth() + 2 + 1, 0);
    return d;
}

export function createDemoTarget(today: Date): Target {
    return {
        id: crypto.randomUUID(),
        description: '3-Monatsziel',
        targetValue: 400,
        targetType: 'billableHours',
        targetUnit: 'hours',
        startDate: getFirstDayOfPreviousMonth(today),
        endDate: getLastDayOfThirdMonth(getFirstDayOfPreviousMonth(today)),
        mondayIsWorkday: true,
        tuesdayIsWorkday: true,
        wednesdayIsWorkday: true,
        thursdayIsWorkday: true,
        fridayIsWorkday: true,
        saturdayIsWorkday: false,
        sundayIsWorkday: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: crypto.randomUUID()
    };
}

// Zufällige Urlaubswoche im Zielzeitraum generieren
export function getRandomVacationWeek(start: Date, end: Date): { start: Date; end: Date } {
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((end.getTime() - start.getTime()) / msPerDay) - 6;
    const offset = Math.floor(Math.random() * Math.max(1, totalDays));
    const vacationStart = new Date(start.getTime() + offset * msPerDay);
    const vacationEnd = new Date(vacationStart.getTime() + 6 * msPerDay);
    return { start: vacationStart, end: vacationEnd };
}

export function createDemoAbsenceEntries(target: Target, today: Date): AbsenceEntry[] {
    const vacation = getRandomVacationWeek(target.startDate, today);
    return [
        {
            id: crypto.randomUUID(),
            userId: target.userId,
            type: 'vacation',
            startDate: vacation.start,
            endDate: vacation.end,
            createdAt: new Date(),
            updatedAt: new Date(),
            description: 'Malediven'
        }
    ];
}


export function createDemoTargetEntries(target: Target, today: Date, absenceEntries: AbsenceEntry[]): TargetEntry[] {
    const absence = absenceEntries[0];
    const vacation = absence && absence.endDate
        ? { start: absence.startDate, end: absence.endDate }
        : undefined;

    // Korrigiere Zuordnung der Wochentage: 0=Sonntag, 1=Montag, ..., 6=Samstag
    // dayIsWorkday[0] = Sonntag, [1] = Montag, ..., [6] = Samstag
    const dayIsWorkday = [
        target.sundayIsWorkday,    // 0 = Sonntag
        target.mondayIsWorkday,    // 1 = Montag
        target.tuesdayIsWorkday,   // 2 = Dienstag
        target.wednesdayIsWorkday, // 3 = Mittwoch
        target.thursdayIsWorkday,  // 4 = Donnerstag
        target.fridayIsWorkday,    // 5 = Freitag
        target.saturdayIsWorkday   // 6 = Samstag
    ];

    // Sammle alle gültigen Arbeitstage im Zeitraum (keine Wochenenden, kein Urlaub)
    const workdays: Date[] = [];
    let d = new Date(target.startDate);
    d.setHours(12, 0, 0, 0);
    while (d <= today && d <= target.endDate) {
        const day = d.getDay(); // 0=Sonntag, 1=Montag, ..., 6=Samstag
        const isWorkday = dayIsWorkday[day];
        const isVacation = vacation && d >= vacation.start && d < vacation.end;
        if (isWorkday && !isVacation) {
            workdays.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
    }

    // Gruppiere Arbeitstage nach Kalenderwoche (ISO-Week)
    function getISOWeek(date: Date) {
        const tmp = new Date(date.getTime());
        tmp.setHours(0, 0, 0, 0);
        // Donnerstag in dieser Woche bestimmt die Kalenderwoche
        tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
        const week1 = new Date(tmp.getFullYear(), 0, 4);
        return (
            tmp.getFullYear() +
            '-W' +
            String(
                1 +
                Math.round(
                    ((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
                )
            ).padStart(2, '0')
        );
    }

    // Map: weekKey -> { dates: Date[] }
    const weekMap = new Map<string, Date[]>();
    for (const date of workdays) {
        const weekKey = getISOWeek(date);
        if (!weekMap.has(weekKey)) {
            weekMap.set(weekKey, []);
        }
        weekMap.get(weekKey)!.push(date);
    }

    // Gesamtwert auf die Arbeitstage verteilen, mit Zufallsschwankung
    const totalValue = workdays.length > 0
        ? Math.round(
            target.targetValue * 1.2 * ((today.getTime() - target.startDate.getTime()) / (target.endDate.getTime() - target.startDate.getTime()))
        )
        : 0;

    // Für jede Woche: Anteil der Arbeitstage an allen Arbeitstagen
    const weekList = Array.from(weekMap.values());
    const totalWorkdays = workdays.length;

    // Für jede Woche einen Wert proportional zu den Arbeitstagen vergeben, mit Zufallsschwankung
    let remaining = totalValue;
    const entries: TargetEntry[] = [];
    for (let i = 0; i < weekList.length; i++) {
        const dates = weekList[i];
        const base = Math.round((dates.length / totalWorkdays) * totalValue);
        const min = Math.max(1, Math.floor(base * 0.8));
        const max = Math.ceil(base * 1.2);
        let value = i === weekList.length - 1
            ? remaining // Rest auf letzte Woche
            : Math.min(max, Math.max(min, Math.floor(Math.random() * (max - min + 1)) + min));
        remaining -= value;
        entries.push({
            id: crypto.randomUUID(),
            targetId: target.id,
            entryValue: value,
            startDate: dates[0],
            endDate: dates[dates.length - 1],
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    return entries;
}

export function createDemoData(today: Date) {
    const target = createDemoTarget(today);
    const absenceEntries = createDemoAbsenceEntries(target, today);
    const targetEntries = createDemoTargetEntries(target, today, absenceEntries);
    return { target, absenceEntries, targetEntries };
}
