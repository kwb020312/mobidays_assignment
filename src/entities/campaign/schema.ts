import { z } from "zod";
import type { Campaign } from "./types";
import { normalizeDate, normalizeNumber } from "@/entities/lib/normalize";

export const campaignSchema = z
  .object({
    id: z.string(),
    name: z
      .string()
      .nullable()
      .transform((v) => v ?? "(이름 없음)"),
    platform: z.enum(["Google", "Meta", "Naver"]),
    status: z.enum(["active", "paused", "ended"]),
    budget: z.number().nullable().transform(normalizeNumber),
    startDate: z.string().nullable().transform(normalizeDate),
    endDate: z.string().nullable().transform(normalizeDate),
  })
  .transform(
    (data): Campaign => ({
      id: data.id,
      name: data.name,
      platform: data.platform,
      status: data.status,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
    })
  );
