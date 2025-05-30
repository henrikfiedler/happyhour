// import { targetInsertSchema } from '$lib/server/db/schema';
import z from 'zod';

const targetInsertSchema = z.object({
//   userId: z.number().int(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetType: z.enum(['billableHours']).default('billableHours'),
  targetValue: z.number().positive(),
  targetUnit: z.enum(['hours']).default('hours'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export { targetInsertSchema }