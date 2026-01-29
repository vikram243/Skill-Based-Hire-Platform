import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.string().regex(objectIdRegex).optional(),
    providerId: z.string().regex(objectIdRegex).optional(),
    title: z.string().min(1),
    message: z.string().min(1),
    type: z.enum(['info', 'warning', 'success', 'error']).optional(),
    link: z.string().url().optional()
  }).refine((d) => !!(d.userId || d.providerId), {
    message: 'Either userId or providerId is required'
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
