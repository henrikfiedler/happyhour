// import { targetInsertSchema } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import z from 'zod';

const targetInsertSchema = z.object({
  description: z.string().min(1).max(255),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetType: z.enum(['billableHours']).default('billableHours'),
  targetValue: z.number().positive(),
  targetUnit: z.enum(['hours']).default('hours'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

const targetEntryInsertSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  entryValue: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export { targetInsertSchema, targetEntryInsertSchema };