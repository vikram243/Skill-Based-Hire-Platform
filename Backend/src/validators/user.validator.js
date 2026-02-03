import { z } from 'zod';

// Accept optional country code +91 or 91 before the 10 digit number
const phoneRegex = /^(?:\+?91)?\d{10}$/;

export const sendOtpSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      number: z.string().regex(phoneRegex, 'Phone number must be 10 digits').optional()
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
      number: z.string().regex(phoneRegex, 'Phone number must be 10 digits (optional country code +91)').optional(),
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
      firstName: z.string().min(2, 'First name required').max(20),
      lastName: z.string().min(2, 'Last name required').max(20),
      email: z.string('Email must be a string').email('Please enter a valid email').min(6, 'Email is required').max(50, 'Email must be less then 50 letters'),
      number: z.string('Phone is required').regex(phoneRegex, 'Phone number must be 10 digits')
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateProfileSchema = z.object({
  body: z
    .object({ 
      firstName: z.string().max(20).optional(),
      lastName: z.string().max(20).optional(),
      location: z.string().max(50, 'Location must be less than 100 letters').optional(),
      bio: z.string().max(200, 'Bio must be less than 200 letters').optional(),
      avatar: z.any().optional()
    }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const refreshSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
