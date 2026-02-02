import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.string().regex(objectIdRegex),
    skill: z.string().regex(objectIdRegex),
    provider: z.string().regex(objectIdRegex),
    urgency: z.enum(['normal', 'emergency']),
    description: z.string(),
    pricing: z.object({
      serviceRate: z.number().nonnegative().optional(),
      taxes: z.number().nonnegative().optional(),
      total: z.number().nonnegative()
    }),
    address: z.object({
      full: z.string().min(10).max(300),
      lat: z.number().optional().nullable(),
      lng: z.number().optional().nullable()
    }),
    contactPhone: z.string().min(10).max(15)
  })
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
