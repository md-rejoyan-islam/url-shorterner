import { baseApi } from "./base-api";
import {
  AddCardRequest,
  CheckoutResponse,
  CreateCheckoutRequest,
  IPayment,
  ISavedCard,
  PaymentFilters,
} from "@/types/payment";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentConfig: builder.query<ApiResponse<{ publishableKey: string }>, void>({
      query: () => "/payments/config",
    }),

    createCheckout: builder.mutation<ApiResponse<CheckoutResponse>, CreateCheckoutRequest>({
      query: (data) => ({
        url: "/payments/checkout",
        method: "POST",
        body: data,
      }),
    }),

    confirmPayment: builder.mutation<ApiResponse<IPayment>, { paymentIntentId: string }>({
      query: (data) => ({
        url: "/payments/confirm",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Subscription", "User"],
    }),

    confirmCheckoutSession: builder.mutation<ApiResponse<{ success: boolean; message: string }>, { sessionId: string }>({
      query: (data) => ({
        url: "/payments/confirm-session",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Subscription", "User"],
    }),

    getCards: builder.query<ApiResponse<ISavedCard[]>, void>({
      query: () => "/payments/cards",
      providesTags: [{ type: "Payment", id: "CARDS" }],
    }),

    getSetupIntent: builder.mutation<ApiResponse<{ clientSecret: string }>, void>({
      query: () => ({
        url: "/payments/cards/setup-intent",
        method: "POST",
      }),
    }),

    addCard: builder.mutation<ApiResponse<ISavedCard>, AddCardRequest>({
      query: (data) => ({
        url: "/payments/cards",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Payment", id: "CARDS" }],
    }),

    removeCard: builder.mutation<ApiResponse<void>, string>({
      query: (paymentMethodId) => ({
        url: `/payments/cards/${paymentMethodId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Payment", id: "CARDS" }],
    }),

    setDefaultCard: builder.mutation<ApiResponse<void>, string>({
      query: (paymentMethodId) => ({
        url: `/payments/cards/${paymentMethodId}/default`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Payment", id: "CARDS" }, "User"],
    }),

    getPaymentHistory: builder.query<ApiResponse<PaginatedResponse<IPayment>>, PaymentFilters | void>({
      query: (params) => ({
        url: "/payments/history",
        params: params || {},
      }),
      providesTags: [{ type: "Payment", id: "HISTORY" }],
    }),

    getPayment: builder.query<ApiResponse<IPayment>, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),

    // Admin endpoints
    getAllPayments: builder.query<ApiResponse<PaginatedResponse<IPayment>>, PaymentFilters | void>({
      query: (params) => ({
        url: "/admin/payments",
        params: params || {},
      }),
      providesTags: [{ type: "Payment", id: "ADMIN_LIST" }],
    }),

    getAnyPayment: builder.query<ApiResponse<IPayment>, string>({
      query: (id) => `/payments/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment", id }],
    }),

    refundPayment: builder.mutation<ApiResponse<IPayment>, string>({
      query: (id) => ({
        url: `/payments/admin/${id}/refund`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Payment", id },
        { type: "Payment", id: "ADMIN_LIST" },
        { type: "Payment", id: "HISTORY" },
      ],
    }),
  }),
});

// Aliases for consistent naming
export const useGetPaymentMethodsQuery = paymentApi.endpoints.getCards.useQuery;
export const useDeletePaymentMethodMutation = paymentApi.endpoints.removeCard.useMutation;
export const useAdminGetPaymentsQuery = paymentApi.endpoints.getAllPayments.useQuery;

export const {
  useGetPaymentConfigQuery,
  useCreateCheckoutMutation,
  useConfirmPaymentMutation,
  useConfirmCheckoutSessionMutation,
  useGetCardsQuery,
  useGetSetupIntentMutation,
  useAddCardMutation,
  useRemoveCardMutation,
  useSetDefaultCardMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentQuery,
  useGetAllPaymentsQuery,
  useGetAnyPaymentQuery,
  useRefundPaymentMutation,
} = paymentApi;
