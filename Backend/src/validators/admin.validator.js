import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const approveProviderSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ providerId: z.string().regex(objectIdRegex) }),
  query: z.object({}).optional()
});

export const rejectProviderSchema = z.object({
  body: z.object({
    reason: z.string().min(10).optional()
  }),
  params: z.object({ providerId: z.string().regex(objectIdRegex) }),
  query: z.object({}).optional()
});

export const getUsersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    role: z.enum(['user', 'provider', 'admin']).optional(),
    skip: z.preprocess(val => Number(val), z.number().nonnegative().optional()),
    limit: z.preprocess(val => Number(val), z.number().positive().optional())
  }).optional()
});

export const getProvidersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    skip: z.preprocess(val => Number(val), z.number().nonnegative().optional()),
    limit: z.preprocess(val => Number(val), z.number().positive().optional())
  }).optional()
});
