import { baseApi } from "./base-api";
import {
  ChangePlanRequest,
  CreateSubscriptionRequest,
  ISubscription,
} from "@/types/subscription";
import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";

interface SubscriptionFilters extends PaginationParams {
  status?: string;
  planId?: string;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<ApiResponse<ISubscription>, void>({
      query: () => "/subscriptions/me",
      providesTags: [{ type: "Subscription", id: "ME" }],
    }),

    getSubscriptionHistory: builder.query<ApiResponse<ISubscription[]>, void>({
      query: () => "/subscriptions/me/history",
      providesTags: [{ type: "Subscription", id: "HISTORY" }],
    }),

    createSubscription: builder.mutation<ApiResponse<ISubscription>, CreateSubscriptionRequest>({
      query: (data) => ({
        url: "/subscriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Subscription", id: "ME" },
        { type: "Subscription", id: "HISTORY" },
        "User",
      ],
    }),

    cancelSubscription: builder.mutation<ApiResponse<ISubscription>, void>({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Subscription", id: "ME" },
        { type: "Subscription", id: "HISTORY" },
        "User",
      ],
    }),

    changePlan: builder.mutation<ApiResponse<ISubscription>, ChangePlanRequest>({
      query: (data) => ({
        url: "/subscriptions/change-plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Subscription", id: "ME" },
        { type: "Subscription", id: "HISTORY" },
        "User",
      ],
    }),

    // Admin endpoints
    getAllSubscriptions: builder.query<
      ApiResponse<PaginatedResponse<ISubscription>>,
      SubscriptionFilters | void
    >({
      query: (params) => ({
        url: "/admin/subscriptions",
        params: params || {},
      }),
      providesTags: [{ type: "Subscription", id: "ADMIN_LIST" }],
    }),

    getSubscription: builder.query<ApiResponse<ISubscription>, string>({
      query: (id) => `/subscriptions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Subscription", id }],
    }),

    updateSubscription: builder.mutation<
      ApiResponse<ISubscription>,
      { id: string; data: Partial<ISubscription> }
    >({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Subscription", id },
        { type: "Subscription", id: "ADMIN_LIST" },
      ],
    }),
  }),
});

// Aliases for consistent naming
export const useGetCurrentSubscriptionQuery = subscriptionApi.endpoints.getMySubscription.useQuery;
export const useAdminGetSubscriptionsQuery = subscriptionApi.endpoints.getAllSubscriptions.useQuery;

export const {
  useGetMySubscriptionQuery,
  useGetSubscriptionHistoryQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useChangePlanMutation,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} = subscriptionApi;
