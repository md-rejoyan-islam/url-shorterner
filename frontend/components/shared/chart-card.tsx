"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  | "pink";

const colorClasses: Record<ColorVariant, { bg: string; text: string }> = {
  brand: { bg: "bg-brand/10", text: "text-brand" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600" },
  red: { bg: "bg-red-500/10", text: "text-red-600" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-600" },
};

interface ChartCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  color?: ColorVariant;
  isLoading?: boolean;
  skeletonHeight?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function ChartCard({
  title,
  description,
  icon: Icon,
  color = "brand",
  isLoading = false,
  skeletonHeight = "h-50",
  children,
  className,
  fullWidth = false,
}: ChartCardProps) {
  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        "border gap-4 border-primary/15 shadow-none bg-white overflow-hidden pt-0 pb-0",
        fullWidth && "lg:col-span-2",
        className
      )}
    >
      <CardHeader className="pt-4">
        <CardTitle className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", colors.bg)}>
            <Icon className={cn("h-4 w-4", colors.text)} />
          </div>
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="border-t border-primary/15 pt-4">
        {isLoading ? (
          <Skeleton className={cn("w-full", skeletonHeight)} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
