import { z } from 'zod';

const phoneRegex = /^\d{7,15}$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const skillEntry = z.object({
  skillId: z.string().regex(objectIdRegex).optional(),
  name: z.string().min(1).optional(),
  isCustom: z.boolean().optional()
}).refine(d => !!(d.skillId || d.name), { message: 'skillId or name required' });

export const becomeProviderSchema = z.object({
  body: z.object({
    businessName: z.string().min(2),
    professionalDescription: z.string().optional(),
    yearsExperience: z.preprocess(val => Number(val), z.number().nonnegative().optional()),
    contactPhone: z.string().regex(phoneRegex).optional(),
    serviceArea: z.any().optional(),
    selectedSkills: z.array(z.union([skillEntry, z.string()])).optional(),
    pricing: z.array(z.any()).optional(),
    agreedToTOS: z.union([z.boolean(), z.string()]).refine(v => v === true || String(v).toLowerCase() === 'true', { message: 'Must agree to TOS' }),
    consentBackgroundCheck: z.union([z.boolean(), z.string()]).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateProviderSchema = z.object({
  body: z.object({
    full_name: z.string().optional(),
    phone: z.string().regex(phoneRegex).optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    hourly_rate: z.preprocess(val => Number(val), z.number().nonnegative().optional()),
    years_experience: z.preprocess(val => Number(val), z.number().nonnegative().optional())
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    notes: z.string().optional()
  }),
  params: z.object({ orderId: z.string().regex(objectIdRegex) }),
  query: z.object({}).optional()
});
