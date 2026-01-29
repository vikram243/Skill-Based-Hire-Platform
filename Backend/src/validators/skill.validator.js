import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    category: z.string().min(1).optional(),
    description: z.string().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const getSkillsByCategorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ category: z.string().min(1) }),
  query: z.object({}).optional()
});
