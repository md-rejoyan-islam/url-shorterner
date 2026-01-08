"use client";

import { Logo } from "@/components/shared/logo";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { publicNavItems } from "@/config/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, LogIn, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled ? "top-1  px-4" : "top-0 px-0"
      }`}
    >
      <header
        className={`mx-auto  transition-all duration-300 ease-out ${
          scrolled
            ? "max-w-6xl  rounded-lg border border-primary/20 shadow-lg  backdrop-blur-sm pt-0"
            : "max-w-full bg-background/95 border-b pt-1 backdrop-blur supports-backdrop-filter:bg-background/60"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#e6560f]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 ${isActive ? "text-[#e6560f]" : ""}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right - Auth buttons */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="hidden md:flex items-center gap-4">
                    <Button asChild variant="ghost">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <UserMenu />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-4">
                    <Button
                      asChild
                      variant="outline"
                      className="border border-border hover:border-[#e6560f]/50 hover:bg-[#e6560f]/5"
                    >
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600"
                    >
                      <Link href="/register">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 px-4 mt-6">
                  <nav className="flex flex-col gap-4">
                    {publicNavItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2 text-lg font-medium transition-colors ${
                            isActive ? "text-[#e6560f]" : "hover:text-primary"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              isActive ? "text-[#e6560f]" : ""
                            }`}
                          />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    {isAuthenticated ? (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="border border-border hover:border-[#e6560f]/50 hover:bg-[#e6560f]/5"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600"
                          onClick={() => setOpen(false)}
                        >
                          <Link href="/register">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
