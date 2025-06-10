// import { targetInsertSchema } from '$lib/server/db/schema';
import Holidays from 'date-holidays';
import z from 'zod';

const targetInsertSchema = z.object({
  description: z.string().trim().min(1).max(255),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  targetType: z.enum(['billableHours']).default('billableHours'),
  targetValue: z.number().positive(),
  targetUnit: z.enum(['hours']).default('hours'),
  mondayIsWorkday: z.boolean().default(true),
  tuesdayIsWorkday: z.boolean().default(true),
  wednesdayIsWorkday: z.boolean().default(true),
  thursdayIsWorkday: z.boolean().default(true),
  fridayIsWorkday: z.boolean().default(true),
  saturdayIsWorkday: z.boolean().default(false),
  sundayIsWorkday: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

const targetUpdateSchema = targetInsertSchema

const targetEntryInsertSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  entryValue: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

const hd = new Holidays()

const holidaySchema = z.object({
  country: z.string().trim().max(2).optional(),
  state: z.string().trim().max(3).optional(),
  region: z.string().trim().max(10).optional(),
}).superRefine((val, ctx) => {
  if (val.country && !val.state) {
    ctx.addIssue({
      code: 'custom',
      message: 'State must be provided if country is provided',
      path: ['state']
    })
  }

  /* const regions = val.country && val.state ? Object.entries(hd.getRegions(val.country, val.state) ?? []) : []
  console.log("🚀 ~ regions:", regions)

  if (val.country && val.state && !val.region && regions.length) {
    ctx.addIssue({
      code: 'custom',
      message: 'Region must be provided if available',
      path: ['region']
    })
  } */

})

/* .refine(
  data => !data.country || data.state,
  { message: "state must be provided if country is provided", path: ['state'] }
).refine(
  data => !data.region || data.country || data.state,
  { message: "region must be provided if avaiable", path: ['region'] }

); */

export { targetInsertSchema, targetEntryInsertSchema, targetUpdateSchema, holidaySchema };