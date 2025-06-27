import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

/* const pgClient = postgres(env.DATABASE_URL)
const client = neon(env.DATABASE_URL); */

export const db = dev ? drizzlePg({ client: postgres(env.DATABASE_URL), schema }) : drizzle({ client: neon(env.DATABASE_URL), schema });
