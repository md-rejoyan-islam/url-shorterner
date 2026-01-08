"use client";

import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Menu, Plus } from "lucide-react";
import Link from "next/link";

export function AuthenticatedHeader() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0  z-30 h-16 border-b bg-background/95 backdrop-blur transition-all duration-300 left-0 ">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <label
            htmlFor="mobile-menu-toggle"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </label>

          {/* Admin badge */}
          {isAdmin && (
            <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Admin Panel
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Show "New URL" button only for non-admin users */}
          {!isAdmin && (
            <Button asChild size="sm" className="hidden sm:flex gap-2">
              <Link href="/dashboard/urls/new">
                <Plus className="h-4 w-4" />
                New URL
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
