"use client";

import { deleteCookie } from "@/app/actions";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { useLogoutMutation } from "@/store/api/auth-api";
import { baseApi } from "@/store/api/base-api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get user from Redux state (set by AuthProvider)
  // This avoids unnecessary API calls on public pages
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const [logoutMutation] = useLogoutMutation();

  const isAdmin = user?.role === "admin";

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Continue with logout even if API fails
    } finally {
      // Delete cookies
      await deleteCookie(AUTH_TOKEN_KEY);
      await deleteCookie(REFRESH_TOKEN_KEY);
      // Reset RTK Query cache to clear user data
      dispatch(baseApi.util.resetApiState());
      // Redirect to login page
      router.push("/login");
    }
  };

  const refetch = () => {
    // Trigger a refetch by invalidating the User tag
    dispatch(baseApi.util.invalidateTags(["User"]));
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    logout,
    refetch,
  };
}
