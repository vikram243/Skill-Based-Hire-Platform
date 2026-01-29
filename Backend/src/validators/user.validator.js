import { z } from 'zod';

const phoneRegex = /^\d{10}$/;

export const sendOtpSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      number: z.string().regex(phoneRegex).optional()
    })
    .refine((d) => !!(d.email || d.number), {
      message: 'Either email or number is required'
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const verifyOtpSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      number: z.string().regex(phoneRegex).optional(),
      otp: z.union([z.string(), z.number()]).refine(v => String(v).trim().length >= 3 && String(v).trim().length <= 8, { message: 'Invalid otp' })
    })
    .refine((d) => !!(d.email || d.number), {
      message: 'Either email or number is required'
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const registerSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(1, 'First name required'),
      lastName: z.string().min(1, 'Last name required'),
      email: z.string().email().optional(),
      number: z.string().regex(phoneRegex).optional()
    })
    .refine((d) => !!(d.email || d.number), {
      message: 'Either email or number is required'
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const refreshSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
