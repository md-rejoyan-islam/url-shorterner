"use client";

import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminNavItems, dashboardNavItems } from "@/config/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useGetMySubscriptionQuery } from "@/store/api/subscription-api";
import clsx from "clsx";
import { ChevronLeft, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Toggle button component rendered via portal
function SidebarToggleButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed top-4 z-50 h-8 w-8 rounded-md border bg-background  transition-all duration-300 hidden lg:flex",
        isOpen ? "left-56" : "left-16"
      )}
      onClick={onToggle}
    >
      <ChevronLeft
        className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")}
      />
    </Button>,
    document.body
  );
}

// Desktop Sidebar - Uses hook for collapse/expand
export function AuthenticatedSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: subscriptionData } = useGetMySubscriptionQuery();

  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminNavItems : dashboardNavItems;

  const subscription = subscriptionData?.data;
  const isFreePlan =
    !subscription || (subscription.plan as any)?.type === "free";

  return (
    <>
      {/* Toggle button rendered via portal */}
      <SidebarToggleButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      <aside
        className={cn(
          "z-40 h-screen border-r bg-background transition-all duration-300 hidden lg:block",
          isOpen ? "w-60" : "w-20"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-center px-4 border-b">
            <div className="flex items-start w-full gap-2 overflow-hidden">
              <Logo showText={isOpen} size="sm" />
              {isAdmin && isOpen && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Admin
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav
            className={clsx("flex-1 space-y-1 py-4", isOpen ? "px-3" : "px-5")}
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                    isOpen ? "gap-3 px-3" : "justify-center",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User: Upgrade CTA - hidden when collapsed */}
          {!isAdmin && isFreePlan && isOpen && (
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
                  <Link href="/dashboard/subscription/upgrade">
                    Upgrade Now
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// Mobile Sidebar - Uses CSS checkbox for visibility
export function MobileAuthenticatedSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: subscriptionData } = useGetMySubscriptionQuery();

  const isAdmin = user?.role === "admin";
  const navItems = isAdmin ? adminNavItems : dashboardNavItems;

  const subscription = subscriptionData?.data;
  const isFreePlan =
    !subscription || (subscription.plan as any)?.type === "free";

  return (
    <>
      {/* Overlay - visible when mobile menu is checked */}
      <label
        htmlFor="mobile-menu-toggle"
        className="fixed inset-0 bg-black/50 z-40 lg:hidden hidden peer-checked/mobile:block cursor-pointer"
      />

      {/* Sidebar - visible when mobile menu is checked */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background lg:hidden -translate-x-full peer-checked/mobile:translate-x-0 transition-transform duration-300">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              {isAdmin && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Admin
                </Badge>
              )}
            </div>
            <label
              htmlFor="mobile-menu-toggle"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </label>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <label key={item.href} htmlFor="mobile-menu-toggle">
                  <Link
                    href={item.href}
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
                </label>
              );
            })}
          </nav>

          {/* User: Upgrade CTA */}
          {!isAdmin && isFreePlan && (
            <div className="p-4 border-t">
              <div className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-white/80 mb-3">
                  Unlock unlimited URLs and more.
                </p>
                <label htmlFor="mobile-menu-toggle">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="w-full bg-white text-blue-600 hover:bg-white/90"
                  >
                    <Link href="/dashboard/subscription/upgrade">
                      Upgrade Now
                    </Link>
                  </Button>
                </label>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
