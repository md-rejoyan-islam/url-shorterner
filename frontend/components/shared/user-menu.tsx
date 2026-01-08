"use client";

import Link from "next/link";
import {
  LogOut,
  Settings,
  User,
  Users,
  CreditCard,
  Shield,
  Receipt,
  Lock,
  Link2,
  Layers,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Mock user for development testing
const DEV_BYPASS_AUTH = true;
const mockUser = {
  firstName: "Test",
  lastName: "User",
  fullName: "Test User",
  email: "test@example.com",
  avatar: null,
  role: "user",
};

export function UserMenu() {
  const { user: authUser, isAdmin: authIsAdmin, logout } = useAuth();

  // Use mock user if dev bypass is enabled and no real user
  const user = authUser || (DEV_BYPASS_AUTH ? mockUser : null);
  const isAdmin = authIsAdmin || (DEV_BYPASS_AUTH && mockUser.role === "admin");

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 border-2 border-brand/20">
            <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
            <AvatarFallback className="bg-brand text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-brand/20">
              <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
              <AvatarFallback className="bg-brand text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isAdmin ? (
            <>
              {/* Admin Menu Items */}
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users" className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/urls" className="cursor-pointer">
                  <Link2 className="mr-2 h-4 w-4" />
                  URLs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/plans" className="cursor-pointer">
                  <Layers className="mr-2 h-4 w-4" />
                  Plans
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/subscriptions" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Subscriptions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/payments" className="cursor-pointer">
                  <Receipt className="mr-2 h-4 w-4" />
                  Payments
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {/* User Menu Items */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="cursor-pointer">
                  <Receipt className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/security" className="cursor-pointer">
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
