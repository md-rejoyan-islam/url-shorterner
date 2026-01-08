"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  actions?: ReactNode;
  variant?: "default" | "gradient" | "subtle";
  icon?: LucideIcon;
  className?: string;
  showAnimatedRings?: boolean;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  variant = "default",
  icon: Icon,
  className,
  showAnimatedRings = true,
}: PageHeaderProps) {
  if (variant === "gradient") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-linear-to-br from-brand/90 via-brand to-brand-light/80 p-6 md:p-8 text-white",
          className
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        {/* Animated rings */}
        {showAnimatedRings && (
          <>
            <div className="absolute top-1/2 right-12 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10 animate-[ping_4s_ease-out_infinite] hidden lg:block" />
            <div className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 animate-[ping_4s_ease-out_infinite_1s] hidden lg:block" />
          </>
        )}

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            {badge && (
              <div className="flex items-center gap-2">
                {badge.icon && <badge.icon className="h-5 w-5" />}
                <span className="text-sm font-medium text-white/80">
                  {badge.text}
                </span>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            {description && (
              <div className="text-white/80 max-w-md">{description}</div>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-brand/10 bg-linear-to-br from-white to-brand/5 p-6 md:p-8",
          className
        )}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--brand)_0.5px,transparent_0.5px)] bg-size-[16px_16px] opacity-[0.15]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            {badge && (
              <Badge className="bg-brand/10 text-brand border-0 px-3 py-1 font-medium">
                {badge.icon && <badge.icon className="h-4 w-4 mr-1.5" />}
                {badge.text}
              </Badge>
            )}
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2.5 rounded-xl bg-linear-to-br from-brand to-brand-light shadow-lg shadow-brand/20">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
                  {title}
                </h1>
                {description && (
                  <div className="text-muted-foreground mt-1">{description}</div>
                )}
              </div>
            </div>
          </div>
          {actions && (
            <div className="flex flex-col sm:flex-row gap-3">{actions}</div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-linear-to-br from-brand to-brand-light shadow-lg shadow-brand/20">
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
          <div>
            {badge && (
              <Badge className="mb-2 bg-brand/10 text-brand border-0 px-3 py-1 font-medium">
                {badge.icon && <badge.icon className="h-3.5 w-3.5 mr-1.5" />}
                {badge.text}
              </Badge>
            )}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {title}
            </h1>
            {description && (
              <div className="text-muted-foreground mt-1">{description}</div>
            )}
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-3">{actions}</div>
      )}
    </div>
  );
}
