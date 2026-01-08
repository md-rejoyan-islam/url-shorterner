"use client";

import { Menu, Bell, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/user-menu";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({
  sidebarOpen,
  onToggleSidebar,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur transition-all duration-300",
        sidebarOpen ? "lg:left-64" : "lg:left-20",
        "left-0"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:flex gap-2">
            <Link href="/dashboard/urls/new">
              <Plus className="h-4 w-4" />
              New URL
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
