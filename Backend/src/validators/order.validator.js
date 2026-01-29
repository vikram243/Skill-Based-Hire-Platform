import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createOrderSchema = z.object({
  body: z.object({
    skill: z.string().regex(objectIdRegex),
    provider: z.string().regex(objectIdRegex),
    urgency: z.enum(['low', 'medium', 'high']).optional(),
    description: z.string().optional(),
    schedule: z.object({
      preferredDate: z.string().datetime().optional(),
      duration: z.number().positive().optional()
    }).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const getOrderSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ orderId: z.string().regex(objectIdRegex) }).optional(),
  query: z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
    skip: z.preprocess(val => Number(val), z.number().nonnegative().optional()),
    limit: z.preprocess(val => Number(val), z.number().positive().optional())
  }).optional()
});
