import { z } from 'zod';

export const sendOtpSchema = z.object({
  method: z.enum(['email', 'number']),
  identifier: z.string().min(1, 'Please enter a value')
}).superRefine((val, ctx) => {
  if (val.method === 'email') {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.identifier);
    if (!ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid email' });
  }
  if (val.method === 'number') {
    const ok = /^\+?\d{10,15}$/.test(val.identifier.replace(/\s+/g, ''));
    if (!ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid phone number' });
  }
});

export const otpSchema = z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code');

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name required').max(20, 'First Name must be less than 20 letters'),
  lastName: z.string().min(2, 'Last name required').max(20, 'Last Name must be less than 20 letters'),
  email: z.string('Email is required').email('Please enter a valid email').min(6, 'Email must be greater that 6 digt').max(50, 'Email must be less then 50 letters'),
  number: z.string('Phone is required').regex(/^\+?\d{10,15}$/, 'Please enter a valid phone')
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(20, 'First Name must be less than 20 letters'),
  email: z.string().email('Please enter a valid email').max(20, 'Last Name must be less than 20 letters'),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Please enter a valid phone'),
  location: z.string().optional(),
  bio: z.string().optional()
});

export const providerBasicSchema = z.object({
  businessName: z.string().min(1, 'Business/Professional Name is required').max(20, 'Business Name must be less than 20 letters'),
  professionalDescription: z.string().min(10, 'Description must be atleast 10 words').max(200, 'Please provide a short professional description'),
  yearsExperience: z.number().min(0).max(100),
  contactPhone: z.string().regex(/^\+?\d{10,15}$/, 'Please enter a valid phone')
});

export const providerLocationSchema = z.object({
  serviceArea: z.object({
    city: z.string().min(1, 'City is required').max(30, 'City name must be less then 30 letters'),
    state: z.string().min(1, 'State is required').max(30, 'State name must be less then 30 letters'),
    pincode: z.string().optional(),
    country: z.string().min(2, 'Country is required').max(30, 'Country name must be less then 30 letters')
  })
});

export const providerSkillsSchema = z.object({
  selectedSkills: z.array(z.any()).min(1, 'Select at least one skill').max(3, 'You can select up to 3 skills'),
  customSkills: z.array(z.any()).max(3)
});

export const providerPricingSchema = z.object({
  pricing: z.array(z.object({
    skill: z.any(),
    rateType: z.string(),
    serviceRate: z.number().min(0.01, 'Service rate must be greater than 0'),
    minimumCharge: z.number().min(0)
  }))
});

export const providerVerificationSchema = z.object({
  agreedToTOS: z.literal(true, { errorMap: () => ({ message: 'You must agree to Terms of Service' }) }),
  consentBackgroundCheck: z.literal(true, { errorMap: () => ({ message: 'Background check consent is required' }) })
});

export const providerFullSchema = z.object({
  businessName: z.string(),
  professionalDescription: z.string(),
  yearsExperience: z.number(),
  contactPhone: z.string(),
  serviceArea: z.any(),
  selectedSkills: z.array(z.any()).min(1, 'Select at least one skill'),
  pricing: z.array(z.any()).min(1, 'Set pricing for your skills'),
  agreedToTOS: z.boolean(),
  consentBackgroundCheck: z.boolean()
});

export function firstZodError(e) {
  if (!e) return 'Invalid input';
  if (Array.isArray(e.issues) && e.issues.length > 0) return e.issues[0]?.message || 'Invalid input';
  if (Array.isArray(e.errors) && e.errors.length > 0) return e.errors[0]?.message || 'Invalid input';
  if (typeof e.message === 'string' && e.message.length > 0) return e.message;
  if (e.error) return firstZodError(e.error);
  return 'Invalid input';
}
