import { deleteCookie, setCookie } from "@/app/actions";
import { siteConfig } from "@/config/site";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/auth-slice";

// Base query with credentials for httpOnly cookies
const baseQuery = fetchBaseQuery({
  baseUrl: siteConfig.apiUrl,
  credentials: "include",
});

// Prevent multiple refresh calls at the same time
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// Try to refresh the access token
const refreshAccessToken = async (
  api: BaseQueryApi,
  extraOptions: object
): Promise<boolean> => {
  try {
    const result = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (result.error) {
      return false;
    }

    // Save new access token
    const data = result.data as { data?: { accessToken?: string } };
    if (data?.data?.accessToken) {
      await setCookie(AUTH_TOKEN_KEY, data.data.accessToken);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

// Clear auth state and cookies
const clearAuth = async (api: BaseQueryApi) => {
  await deleteCookie(AUTH_TOKEN_KEY);
  await deleteCookie(REFRESH_TOKEN_KEY);
  api.dispatch(logout());
};

// Check if current page is protected (needs redirect on auth failure)
const isProtectedRoute = (): boolean => {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path.startsWith("/dashboard") || path.startsWith("/admin");
};

// Main query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Make the request
  let result = await baseQuery(args, api, extraOptions);

  // If not 401, return as-is
  if (result.error?.status !== 401) {
    return result;
  }

  const url = typeof args === "string" ? args : args.url;

  // Don't try to refresh if refresh-token endpoint itself failed
  if (url === "/auth/refresh-token") {
    await clearAuth(api);
    if (isProtectedRoute()) {
      window.location.href = "/login";
    }
    return result;
  }

  // Wait if already refreshing
  if (isRefreshing && refreshPromise) {
    const success = await refreshPromise;
    if (success) {
      return await baseQuery(args, api, extraOptions);
    }
    return result;
  }

  // Try to refresh token
  isRefreshing = true;
  refreshPromise = refreshAccessToken(api, extraOptions);

  const success = await refreshPromise;
  isRefreshing = false;
  refreshPromise = null;

  if (success) {
    // Retry original request with new token
    return await baseQuery(args, api, extraOptions);
  }

  // Refresh failed - clear auth
  await clearAuth(api);
  if (isProtectedRoute()) {
    window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Url", "Click", "Plan", "Subscription", "Payment", "Device"],
  endpoints: () => ({}),
});
