import { baseApi } from "./base-api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  UpdateProfileRequest,
} from "@/types/auth";
import { IDevice, IUsage, IUser } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Cache invalidation is done manually after setting cookies in login-form.tsx
    }),

    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["User", "Device"],
    }),

    logoutAll: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout-all",
        method: "POST",
      }),
      invalidatesTags: ["User", "Device"],
    }),

    refreshToken: builder.mutation<ApiResponse<{ accessToken: string }>, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    getMe: builder.query<ApiResponse<IUser>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    updateMe: builder.mutation<ApiResponse<IUser>, UpdateProfileRequest>({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteAccount: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/me",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    uploadAvatar: builder.mutation<ApiResponse<IUser>, FormData>({
      query: (formData) => ({
        url: "/auth/me/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    getUsage: builder.query<ApiResponse<IUsage>, void>({
      query: () => "/auth/me/usage",
      providesTags: ["User", "Url"],
    }),

    changePassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<ApiResponse<void>, VerifyEmailRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resendVerification: builder.mutation<ApiResponse<void>, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: data,
      }),
    }),

    getDevices: builder.query<ApiResponse<IDevice[]>, void>({
      query: () => "/auth/devices",
      providesTags: ["Device"],
    }),

    removeDevice: builder.mutation<ApiResponse<void>, string>({
      query: (deviceId) => ({
        url: `/auth/devices/${deviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Device"],
    }),
  }),
});

// Alias for consistent naming
export const useUpdateProfileMutation = authApi.endpoints.updateMe.useMutation;

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useDeleteAccountMutation,
  useUploadAvatarMutation,
  useGetUsageQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useGetDevicesQuery,
  useRemoveDeviceMutation,
} = authApi;
