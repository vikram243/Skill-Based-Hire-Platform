import { z } from "zod";

const phoneRegex = /^\+?\d{10,15}$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const skillEntry = z.object({
  skillId: z.string().regex(objectIdRegex).nullable().optional(),
  name: z.string().min(1, "Skill name required"),
});

const pricingEntry = z
  .object({
    skill: skillEntry.optional(),
    rateType: z.enum(["hourly", "perJob", "daily"]),
    serviceRate: z.preprocess(
      (v) => Number(v),
      z.number().positive("Service rate must be > 0"),
    ),
  })
  .transform((val, ctx) => {
    const parent = ctx.parent;
    if (!val.skill && parent?.selectedSkill) {
      val.skill = parent.selectedSkill;
    }
    return val;
  });

const parseJSON = (val) => {
  try {
    if (!val) return undefined;

    if (typeof val === "string") return JSON.parse(val);

    if (Array.isArray(val))
      return typeof val[0] === "string" ? JSON.parse(val[0]) : val[0];

    return val;
  } catch {
    return undefined;
  }
};

export const becomeProviderSchema = z.object({
  body: z.object({
    businessName: z.string().min(2, "Business name too short"),

    professionalDescription: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(200),

    yearsExperience: z.preprocess(
      (v) => (v === "" ? 0 : Number(v)),
      z.number().min(0).max(100),
    ),

    contactPhone: z.string().regex(phoneRegex, "Invalid phone number"),

    serviceArea: z.any().optional(),

    selectedSkill: z.preprocess(
      parseJSON,
      skillEntry.refine((v) => v !== undefined, {
        message: "Skill required",
      }),
    ),

    pricing: z.preprocess(parseJSON, pricingEntry),

    agreedToTOS: z
      .union([z.boolean(), z.string()])
      .refine((v) => v === true || String(v).toLowerCase() === "true", {
        message: "Must agree to Terms",
      }),

    consentBackgroundCheck: z
      .union([z.boolean(), z.string()])
      .refine((v) => v === true || String(v).toLowerCase() === "true", {
        message: "Background consent required",
      }),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProviderSchema = z.object({
  body: z.object({
    full_name: z.string().optional(),

    phone: z.string().regex(phoneRegex, "Invalid phone").optional(),

    location: z.string().optional(),
    bio: z.string().optional(),

    hourly_rate: z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().nonnegative().optional(),
    ),

    years_experience: z.preprocess(
      (v) => (v === "" ? undefined : Number(v)),
      z.number().nonnegative().optional(),
    ),
  }),

  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
    notes: z.string().optional(),
  }),

  params: z.object({
    orderId: z.string().regex(objectIdRegex),
  }),

  query: z.object({}).optional(),
});
