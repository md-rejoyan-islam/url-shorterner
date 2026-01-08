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

type ColorVariant = "brand" | "emerald" | "violet" | "amber" | "blue" | "pink" | "rose";

const colorClasses: Record<ColorVariant, { bg: string; text: string }> = {
  brand: { bg: "bg-brand/10", text: "text-brand" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-600" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-600" },
};

interface InfoCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  color?: ColorVariant;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function InfoCard({
  title,
  description,
  icon: Icon,
  color = "brand",
  children,
  className,
}: InfoCardProps) {
  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        "border border-primary/15 shadow-none bg-white py-4",
        className
      )}
    >
      <CardHeader>
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
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface InfoCardRowProps {
  label: string;
  value: ReactNode;
  isLoading?: boolean;
  hasBorder?: boolean;
}

export function InfoCardRow({
  label,
  value,
  isLoading = false,
  hasBorder = false,
}: InfoCardRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-2",
        hasBorder && "border-b"
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      {isLoading ? (
        <Skeleton className="h-5 w-24" />
      ) : (
        <span className="font-medium">{value}</span>
      )}
    </div>
  );
}
