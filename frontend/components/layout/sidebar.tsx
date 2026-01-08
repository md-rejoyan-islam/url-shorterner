"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { dashboardNavItems } from "@/config/navigation";
import { useGetMySubscriptionQuery } from "@/store/api/subscription-api";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: subscriptionData } = useGetMySubscriptionQuery();

  const subscription = subscriptionData?.data;
  const isFreePlan = !subscription || (subscription.plan as any)?.type === "free";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 hidden lg:block",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Logo showText={isOpen} size="sm" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggle}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                !isOpen && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {dashboardNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade CTA */}
        {isFreePlan && isOpen && (
          <div className="p-4 border-t">
            <div className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <span className="font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-sm text-white/80 mb-3">
                Unlock unlimited URLs, analytics, and more.
              </p>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-white/90"
              >
                <Link href="/dashboard/subscription/upgrade">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// Mobile Sidebar
export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data: subscriptionData } = useGetMySubscriptionQuery();

  const subscription = subscriptionData?.data;
  const isFreePlan = !subscription || (subscription.plan as any)?.type === "free";

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background lg:hidden">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Logo size="sm" />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {dashboardNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {isFreePlan && (
            <div className="p-4 border-t">
              <div className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-white/80 mb-3">
                  Unlock unlimited URLs and more.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-white/90"
                  onClick={onClose}
                >
                  <Link href="/dashboard/subscription/upgrade">Upgrade Now</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
