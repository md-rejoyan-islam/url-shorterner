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

interface DataCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  color?: ColorVariant;
  isLoading?: boolean;
  loadingRows?: number;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  emptyState?: {
    icon?: LucideIcon;
    message: string;
  };
  isEmpty?: boolean;
}

export function DataCard({
  title,
  description,
  icon: Icon,
  color = "brand",
  isLoading = false,
  loadingRows = 5,
  children,
  className,
  noPadding = true,
  emptyState,
  isEmpty = false,
}: DataCardProps) {
  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        "border gap-4 border-primary/15 shadow-none bg-white overflow-hidden pt-0 pb-4",
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
      <CardContent
        className={cn("border-t border-primary/15", noPadding ? "p-0" : "pt-4")}
      >
        {isLoading ? (
          <div className="divide-y divide-primary/10">
            {Array.from({ length: loadingRows }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-6"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : isEmpty && emptyState ? (
          <div className="text-center py-8">
            {emptyState.icon && (
              <emptyState.icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            )}
            <p className="text-muted-foreground">{emptyState.message}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
