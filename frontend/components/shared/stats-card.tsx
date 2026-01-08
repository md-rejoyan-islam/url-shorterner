"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type ColorVariant =
  | "brand"
  | "emerald"
  | "violet"
  | "amber"
  | "red"
  | "blue"
  | "pink"
  | "rose";

const colorClasses: Record<ColorVariant, { bg: string; text: string }> = {
  brand: { bg: "bg-brand/10", text: "text-brand" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600" },
  red: { bg: "bg-red-500/10", text: "text-red-600" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-600" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-600" },
};

interface StatsCardProps {
  title: string;
  value: string | number | ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  color?: ColorVariant;
  isLoading?: boolean;
  className?: string;
  valueClassName?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "brand",
  isLoading = false,
  className,
  valueClassName,
}: StatsCardProps) {
  const colors = colorClasses[color] || colorClasses.brand;

  return (
    <Card
      className={cn(
        "border border-primary/15 py-2 shadow-none bg-white ",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className={cn("text-2xl font-bold", valueClassName)}>
                {value}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-xl", colors.bg)}>
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
