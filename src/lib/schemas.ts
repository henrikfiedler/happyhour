// import { targetInsertSchema } from '$lib/server/db/schema';
import Holidays from 'date-holidays';
import z from 'zod/v4';
import de from 'zod/v4/locales/de.js';

z.config(de())

const loginSchema = z.object({
  email: z.email().min(5).max(255),
  password: z.string().min(8).max(100),
});

const registerSchema = loginSchema.extend({
  privacyPolicy: z.boolean().refine(val => val === true, 'Bitte akzeptiere die Datenschutzerklärung.'),
})

const forgotPasswortRequestSchema = loginSchema.pick({ email: true })
const forgotPasswortSubmitSchema = loginSchema.pick({ password: true }).extend({ token: z.string() })

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
}).check((val) => {
  if (val.value.endDate <= val.value.startDate) {
    val.issues.push({
      code: 'custom',
      message: 'Startdatum muss vor dem Enddatum liegen.',
      input: val.value.startDate,
      path: ['startDate'],
    });
    val.issues.push({
      code: 'custom',
      message: 'Enddatum muss nach dem Startdatum sein.',
      input: val.value.endDate,
      path: ['endDate']
    })
  }
})

const targetUpdateSchema = targetInsertSchema

const tommorrow = new Date(new Date());
tommorrow.setHours(0, 0, 0, 0);
tommorrow.setDate(tommorrow.getDate() + 1);

const targetEntryInsertSchema = z.object({
  startDate: z.coerce.date().check((val) => {
    if (val.value >= tommorrow) {
      val.issues.push({
        code: 'custom',
        message: 'Startdatum darf nicht in der Zukunft liegen.',
        input: val.value,
      })
    }
  }),
  endDate: z.coerce.date().optional().check((val) => {
    if (val.value && val.value >= tommorrow) {
      val.issues.push({
        code: 'custom',
        message: 'Enddatum darf nicht in der Zukunft liegen.',
        input: val.value,
      })
    }
  }),
  entryValue: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).check((val) => {
  if (val.value.endDate && val.value.endDate < val.value.startDate) {
    console.log('error')
    val.issues.push({
      code: 'custom',
      message: 'Startdatum muss vor dem Enddatum sein.',
      input: val.value.startDate,
      path: ['startDate']
    })
    val.issues.push({
      code: 'custom',
      message: 'Enddatum muss nach dem Startdatum sein.',
      input: val.value.endDate,
      path: ['endDate']
    })
  };
})

const hd = new Holidays()

const holidaySchema = z.object({
  country: z.string().trim().max(2).optional(),
  state: z.string().trim().max(3).optional(),
  region: z.string().trim().max(10).optional(),
}).check((val) => {
  if (val.value.country && !val.value.state) {
    val.issues.push({
      code: 'custom',
      message: 'Staat muss gepflegt sein, wenn ein Land gepflegt ist.',
      input: val.value.country,
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
}).check((val) => {
  if (val.value.endDate && val.value.endDate < val.value.startDate) {
    console.log('error')
    val.issues.push({
      code: 'custom',
      message: 'Startdatum muss vor dem Enddatum sein.',
      input: val.value.startDate,
      path: ['startDate']
    })
    val.issues.push({
      code: 'custom',
      message: 'Enddatum muss nach dem Startdatum sein.',
      input: val.value.endDate,
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
  absenceEntryInsertSchema,
  forgotPasswortRequestSchema,
  forgotPasswortSubmitSchema
};