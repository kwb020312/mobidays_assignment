
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Select,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from "@/shared/ui";
import { cn } from "@/shared/lib";
import { ALL_PLATFORMS, PLATFORM_LABELS, type Platform } from "@/shared/types";
import { useDataStore } from "@/shared/stores";
import {
  CALENDAR_START_MONTH,
  CALENDAR_END_MONTH,
} from "@/shared/constants";
import { campaignFormSchema, type CampaignFormData } from "../schema";

export function CampaignRegistrationModal() {
  const [open, setOpen] = useState(false);
  const addCampaign = useDataStore((state) => state.addCampaign);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      platform: undefined,
      budget: undefined,
      cost: undefined,
      startDate: "",
      endDate: "",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = (data: CampaignFormData) => {
    const newCampaign = {
      id: crypto.randomUUID(),
      name: data.name,
      platform: data.platform as Platform,
      status: "active" as const,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    addCampaign(newCampaign);
    reset();
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        캠페인 등록
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>캠페인 등록</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 캠페인명 */}
          <div className="space-y-2">
            <Label htmlFor="name">캠페인명 *</Label>
            <Input
              id="name"
              placeholder="캠페인명을 입력하세요 (2~100자)"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* 광고 매체 */}
          <div className="space-y-2">
            <Label htmlFor="platform">광고 매체 *</Label>
            <Select
              id="platform"
              options={ALL_PLATFORMS.map((p) => ({
                value: p,
                label: PLATFORM_LABELS[p],
              }))}
              placeholder="매체 선택"
              {...register("platform")}
            />
            {errors.platform && (
              <p className="text-sm text-destructive">
                {errors.platform.message}
              </p>
            )}
          </div>

          {/* 예산 */}
          <div className="space-y-2">
            <Label htmlFor="budget">예산 (원) *</Label>
            <Input
              id="budget"
              type="number"
              placeholder="100 ~ 1,000,000,000"
              {...register("budget", { valueAsNumber: true })}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">
                {errors.budget.message}
              </p>
            )}
          </div>

          {/* 집행 금액 */}
          <div className="space-y-2">
            <Label htmlFor="cost">집행 금액 (원) *</Label>
            <Input
              id="cost"
              type="number"
              placeholder="0 ~ 예산 이하"
              {...register("cost", { valueAsNumber: true })}
            />
            {errors.cost && (
              <p className="text-sm text-destructive">{errors.cost.message}</p>
            )}
          </div>

          {/* 시작일 */}
          <div className="space-y-2">
            <Label>시작일 *</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  />
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(new Date(startDate), "yyyy년 M월 d일", { locale: ko })
                  : "시작일 선택"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={CALENDAR_START_MONTH}
                  endMonth={CALENDAR_END_MONTH}
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setValue("startDate", format(date, "yyyy-MM-dd"), {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-sm text-destructive">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* 종료일 */}
          <div className="space-y-2">
            <Label>종료일 *</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  />
                }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate
                  ? format(new Date(endDate), "yyyy년 M월 d일", { locale: ko })
                  : "종료일 선택"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={CALENDAR_START_MONTH}
                  endMonth={CALENDAR_END_MONTH}
                  selected={endDate ? new Date(endDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setValue("endDate", format(date, "yyyy-MM-dd"), {
                        shouldValidate: true,
                      });
                    }
                  }}
                  disabled={(date) =>
                    startDate ? date < new Date(startDate) : false
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-sm text-destructive">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
