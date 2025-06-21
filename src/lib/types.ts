import type { DBUser, DBSession, DBTarget, DBTargetEntry, DBAbsenceEntry } from "./server/db/schema";

// type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type PickPartial<T, K extends keyof T> = { [P in K]: Partial<T[P]> };

export type OrderByType = "asc" | "desc";

export type User = Omit<DBUser, "passwordHash">;
export type AuthUser = PickPartial<DBUser, 'id' | 'email' | 'createdAt' | 'updatedAt'>
export type Session = DBSession
export type Target = DBTarget
export type TargetEntry = DBTargetEntry
// export type AbsencePlan = DBAbsencePlan
export type AbsenceEntry = DBAbsenceEntry

export const absenceEntryTypesArray: { value: string, label: string }[] = [
	{
		value: 'vacation',
		label: 'Urlaub'
	},
	{
		value: 'sick',
		label: 'Krankheit'
	},
	{
		value: 'misc',
		label: 'Sonstiges'
	}
] as const

export type AbsenceEntryType = typeof absenceEntryTypesArray[number]['value'];

export const absenceEntryValues: [AbsenceEntryType, ...AbsenceEntryType[]] =
	absenceEntryTypesArray.map(e => e.value) as [AbsenceEntryType, ...AbsenceEntryType[]];



export type TargetEntryComparison = {
	date: Date;
	planned: number;
	actual: number | null;
}

export type TNavUser = {
	// name: string;
	email: string;
	avatar: string;
};

export type NavActiveType = 'include' | 'exact';

export type NavBuildItem = {
	title: string;
	url: string;
	icon: any; // This should be `Component` after @lucide/svelte updates types
	activeType?: NavActiveType;
	items?: NavBuildItem[];
}

export type NavItem = {
	title: string;
	url: string;
	icon: any; // This should be `Component` after @lucide/svelte updates types
	isActive?: boolean;
	items?: NavItem[];
};