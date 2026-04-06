import { STATUS_LABELS, PLATFORM_LABELS } from "@/shared/types";
import type { CampaignStatus, Platform } from "@/shared/types";
import type { MultiSelectOption } from "../ui/MultiSelect";

export const STATUS_OPTIONS: MultiSelectOption<CampaignStatus>[] = [
  { value: "active", label: STATUS_LABELS.active },
  { value: "paused", label: STATUS_LABELS.paused },
  { value: "ended", label: STATUS_LABELS.ended },
];

export const PLATFORM_OPTIONS: MultiSelectOption<Platform>[] = [
  { value: "Google", label: PLATFORM_LABELS.Google },
  { value: "Meta", label: PLATFORM_LABELS.Meta },
  { value: "Naver", label: PLATFORM_LABELS.Naver },
];
