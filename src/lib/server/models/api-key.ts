import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from '../db';
import { apiKeyTable } from '../db/schema';
import type { ApiKey, AuthUser } from '$lib/types';

const apiKeyPrefix = 'happyh_live_';

function hashApiKey(apiKey: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(apiKey)));
}

export function generateApiKey() {
	const tokenBytes = new Uint8Array(32);
	crypto.getRandomValues(tokenBytes);
	return `${apiKeyPrefix}${encodeBase32LowerCaseNoPadding(tokenBytes)}`;
}

export async function createApiKey(user: AuthUser, name: string) {
	const key = generateApiKey();
	const [apiKey] = await db.insert(apiKeyTable).values({
		userId: user.id,
		name,
		keyPrefix: key.slice(0, 16),
		keyHash: hashApiKey(key)
	}).returning();

	return {
		apiKey: apiKey && {
			id: apiKey.id,
			name: apiKey.name,
			keyPrefix: apiKey.keyPrefix,
			createdAt: apiKey.createdAt
		},
		key
	};
}

export async function getApiKeys(user: AuthUser): Promise<ApiKey[]> {
	return db.query.apiKeyTable.findMany({
		where: (apiKey, { and }) => and(
			eq(apiKey.userId, user.id),
			isNull(apiKey.revokedAt)
		),
		columns: { keyHash: false },
		orderBy: [desc(apiKeyTable.createdAt)]
	});
}

export async function validateApiKey(key: string): Promise<AuthUser | null> {
	if (!key.startsWith(apiKeyPrefix)) return null;

	const apiKey = await db.query.apiKeyTable.findFirst({
		where: and(
			eq(apiKeyTable.keyHash, hashApiKey(key)),
			isNull(apiKeyTable.revokedAt)
		),
		with: {
			user: {
				columns: {
					id: true,
					email: true,
					emailVerified: true,
					createdAt: true,
					updatedAt: true,
					admin: true
				}
			}
		}
	});

	if (!apiKey) return null;

	await db.update(apiKeyTable)
		.set({ lastUsedAt: new Date() })
		.where(eq(apiKeyTable.id, apiKey.id));

	return apiKey.user;
}

export async function revokeApiKeys(user: AuthUser, apiKeyIds: string[]) {
	if (apiKeyIds.length === 0) return;

	await db.update(apiKeyTable)
		.set({ revokedAt: new Date() })
		.where(and(
			inArray(apiKeyTable.id, apiKeyIds),
			eq(apiKeyTable.userId, user.id),
			isNull(apiKeyTable.revokedAt)
		));
}
