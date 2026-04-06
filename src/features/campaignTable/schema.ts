import { z } from "zod";
import { MAX_BUDGET, MIN_BUDGET } from "./constants";

export const campaignFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "캠페인명은 2자 이상이어야 합니다")
      .max(100, "캠페인명은 100자 이하여야 합니다"),
    platform: z.enum(["Google", "Meta", "Naver"], {
      message: "광고 매체를 선택해주세요",
    }),
    budget: z
      .number({ message: "예산을 입력해주세요" })
      .int("정수로 입력해주세요")
      .min(MIN_BUDGET, "예산은 최소 100원 이상이어야 합니다")
      .max(MAX_BUDGET, "예산은 최대 10억 원까지 가능합니다"),
    cost: z
      .number({ message: "집행 금액을 입력해주세요" })
      .int("정수로 입력해주세요")
      .min(0, "집행 금액은 0원 이상이어야 합니다")
      .max(MAX_BUDGET, "집행 금액은 최대 10억 원까지 가능합니다"),
    startDate: z.string().min(1, "시작일을 선택해주세요"),
    endDate: z.string().min(1, "종료일을 선택해주세요"),
  })
  .refine((data) => data.cost <= data.budget, {
    message: "집행 금액은 예산을 초과할 수 없습니다",
    path: ["cost"],
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "종료일은 시작일 이후여야 합니다",
      path: ["endDate"],
    }
  );

export type CampaignFormData = z.infer<typeof campaignFormSchema>;
