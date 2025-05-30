import type { DBUser, DBSession, DBTarget } from "./server/db/schema";

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = Omit<DBUser, "passwordHash">;
export type Session = DBSession
export type Target = DBTarget