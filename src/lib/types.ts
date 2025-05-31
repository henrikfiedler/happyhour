import type { DBUser, DBSession, DBTarget, DBTargetEntry } from "./server/db/schema";

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OrderByType = "asc" | "desc";

export type User = Omit<DBUser, "passwordHash">;
export type Session = DBSession
export type Target = DBTarget
export type TargetEntry = DBTargetEntry

export type TNavUser = {
		// name: string;
		email: string;
		avatar: string;
	};
