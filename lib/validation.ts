import { z } from "zod";
import { COUNTRIES } from "@/constants/controversies-countries";

export const controversiesQuerySchema = z.object({
  country: z
    .string()
    .min(1, "No country specified")
    .regex(/^[a-zA-Z]{2}$/, "Country must be a 2-character country code")
    .toLowerCase()
    .refine((code) => code in COUNTRIES, "Unsupported country code"),
  limit: z
    .string()
    .default("30")
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(1).max(100)),
});

export type ControversiesQuery = z.infer<typeof controversiesQuerySchema>;

export function validateControversiesParams(searchParams: URLSearchParams) {
  const country = searchParams.get("country");
  const limit = searchParams.get("limit") || "30";

  if (!country) {
    return {
      success: false,
      error: { issues: [{ message: "No country specified" }] },
    } as const;
  }

  return controversiesQuerySchema.safeParse({ country, limit });
}
