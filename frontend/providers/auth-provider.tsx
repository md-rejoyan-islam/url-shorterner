"use client";

import { useGetMeQuery } from "@/store/api/auth-api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/auth-slice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Auth pages - redirect to dashboard if already logged in
const authPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const protectedRouteStarters = ["/dashboard", "/admin"];

interface AuthProviderProps {
  children: React.ReactNode;
  hasAuthCookies: boolean;
}

export function AuthProvider({ children, hasAuthCookies }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, authChecked } = useAppSelector(
    (state) => state.auth
  );

  // Only call /auth/me if cookies exist and we haven't checked yet
  const shouldFetchUser = hasAuthCookies && !authChecked;

  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser,
  });

  // Set user data from API response
  useEffect(() => {
    if (!shouldFetchUser) {
      // No cookies = no user
      if (!hasAuthCookies && !authChecked) {
        dispatch(setUser(null));
      }
      return;
    }

    if (isLoading) return;

    if (data?.data) {
      dispatch(setUser(data.data));
    } else if (error) {
      dispatch(setUser(null));
    }
  }, [
    data,
    error,
    isLoading,
    shouldFetchUser,
    hasAuthCookies,
    authChecked,
    dispatch,
  ]);

  // Handle redirects based on auth state
  useEffect(() => {
    // Wait until auth check is complete
    if (!authChecked) return;

    // Check if current path starts with any protected route
    const isProtectedRoute = protectedRouteStarters.some((starter) =>
      pathname.startsWith(starter)
    );

    // Check if current path is an auth path
    const isAuthPath = authPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

    // Not logged in + trying to access protected route → go to login
    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    // Logged in + on auth page → go to /dashboard if user, /admin if admin
    if (isAuthenticated && isAuthPath) {
      const redirectPath = user?.role === "admin" ? "/admin" : "/dashboard";
      router.replace(redirectPath);
      return;
    }
  }, [isAuthenticated, authChecked, pathname, router, user]);

  return <>{children}</>;
}
