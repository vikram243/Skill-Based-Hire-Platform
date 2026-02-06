import { z } from 'zod';

export const coordinatesSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    address: z.string().min(1, 'Address is required')
  })
});

export const distanceTimeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required')
  })
});

export const suggestionsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    input: z.string().min(1, 'Input is required')
  })
});

export const reverseSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    lat: z.preprocess((v) => Number(v), z.number()),
    lng: z.preprocess((v) => Number(v), z.number())
  })
});

export default {
  coordinatesSchema,
  distanceTimeSchema,
  suggestionsSchema,
  reverseSchema
};
