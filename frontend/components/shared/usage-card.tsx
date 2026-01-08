"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, LucideIcon } from "lucide-react";

type ColorVariant = "brand" | "emerald" | "violet" | "amber" | "blue" | "pink";

const colorClasses: Record<
  ColorVariant,
  { bg: string; text: string; progress: string }
> = {
  brand: {
    bg: "bg-brand/10",
    text: "text-brand",
    progress: "bg-brand/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    progress: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-600",
    progress: "bg-violet-100 dark:bg-violet-900/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    progress: "bg-amber-100 dark:bg-amber-900/30",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    progress: "bg-blue-100 dark:bg-blue-900/30",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-600",
    progress: "bg-pink-100 dark:bg-pink-900/30",
  },
};

interface UsageCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  color?: ColorVariant;
  current: number;
  max: number | -1;
  formatValue?: (value: number) => string;
  isLoading?: boolean;
  showWarning?: boolean;
  warningThreshold?: number;
  className?: string;
}

export function UsageCard({
  title,
  description,
  icon: Icon,
  color = "brand",
  current,
  max,
  formatValue = (v) => v.toLocaleString(),
  isLoading = false,
  showWarning = true,
  warningThreshold = 80,
  className,
}: UsageCardProps) {
  const colors = colorClasses[color];
  const isUnlimited = max === -1;
  const percentage = isUnlimited ? 0 : (current / max) * 100;
  const showLimitWarning =
    showWarning && !isUnlimited && percentage > warningThreshold;

  return (
    <Card
      className={cn(
        "border border-primary/15 shadow-none bg-white py-4",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl", colors.bg)}>
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <span className="text-4xl font-bold">{formatValue(current)}</span>
            )}
            {isLoading ? (
              <Skeleton className="h-5 w-24" />
            ) : (
              <span className="text-muted-foreground">
                of {isUnlimited ? "Unlimited" : formatValue(max)}
              </span>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-3 w-full rounded-full" />
          ) : (
            <Progress value={percentage} className={cn("h-3", colors.progress)} />
          )}
          {showLimitWarning && (
            <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Approaching limit - consider upgrading
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
