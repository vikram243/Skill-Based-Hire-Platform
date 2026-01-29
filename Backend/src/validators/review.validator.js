import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createReviewSchema = z.object({
  body: z.object({
    order: z.string().regex(objectIdRegex),
    provider: z.string().regex(objectIdRegex),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const getProviderReviewsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().regex(objectIdRegex) }),
  query: z.object({}).optional()
});
