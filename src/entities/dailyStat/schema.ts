import { z } from "zod";
import type { DailyStat } from "./types";
import { normalizeDate, normalizeNumber } from "@/entities/lib/normalize";

export const dailyStatSchema = z
  .object({
    id: z.string(),
    campaignId: z.string(),
    date: z.string().nullable().transform(normalizeDate),
    impressions: z.number().nullable().transform(normalizeNumber),
    clicks: z.number().nullable().transform(normalizeNumber),
    conversions: z.number().nullable().transform(normalizeNumber),
    cost: z.number().nullable().transform(normalizeNumber),
    conversionsValue: z.number().nullable(),
  })
  .transform((data): DailyStat | null => {
    if (!data.date) return null;
    return {
      id: data.id,
      campaignId: data.campaignId,
      date: data.date,
      impressions: data.impressions,
      clicks: data.clicks,
      conversions: data.conversions,
      cost: data.cost,
      conversionsValue: data.conversionsValue,
    };
  });
