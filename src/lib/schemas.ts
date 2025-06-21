// import { targetInsertSchema } from '$lib/server/db/schema';
import Holidays from 'date-holidays';
import z from 'zod';

const loginSchema = z.object({
  email: z.string().email().min(5).max(255),
  password: z.string().min(8).max(100),
});

const registerSchema = loginSchema.extend({
  privacyPolicy: z.boolean().refine(val => val === true, 'Please read and accept the privacy policy.')
})

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

/* const absencePlanInsertSchema = z.object({
  year: z.number().min(1900).max(9999),
  sickValue: z.number().min(0),
  vacationValue: z.number().min(0),
  miscValue: z.number().min(0),
}); */

const absenceEntryInsertSchema = z.object({
  type: z.enum(['vacation', 'sick', 'misc']).default('vacation'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  description: z.string().trim().max(30).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).superRefine((val, ctx) => {
  if (val.endDate && val.endDate < val.startDate) {
    console.log('error')
    ctx.addIssue({
      code: 'invalid_date',
      message: 'Start date must be before end date.',
      path: ['startDate']
    })
    ctx.addIssue({
      code: 'invalid_date',
      message: 'End date must be after start date.',
      path: ['endDate']
    })
  };
})

export {
  loginSchema,
  registerSchema,
  targetInsertSchema,
  targetEntryInsertSchema,
  targetUpdateSchema,
  holidaySchema,
  // absencePlanInsertSchema,
  absenceEntryInsertSchema
};