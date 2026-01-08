import { baseApi } from "./base-api";
import { CreatePlanRequest, IPlan, UpdatePlanRequest } from "@/types/plan";
import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<ApiResponse<PaginatedResponse<IPlan>>, PaginationParams | void>({
      query: (params) => ({
        url: "/plans",
        params: params || {},
      }),
      providesTags: (result) => {
        // Handle multiple possible response structures
        const plans = result?.data?.plans || result?.data?.data || (Array.isArray(result?.data) ? result?.data : []);
        return plans.length > 0
          ? [
              ...plans.map((plan: IPlan) => ({ type: "Plan" as const, id: plan._id || plan.id })),
              { type: "Plan", id: "LIST" },
            ]
          : [{ type: "Plan", id: "LIST" }];
      },
    }),

    getPlan: builder.query<ApiResponse<IPlan>, string>({
      query: (id) => `/plans/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Plan", id }],
    }),

    getPlanBySlug: builder.query<ApiResponse<IPlan>, string>({
      query: (slug) => `/plans/slug/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Plan", id: slug }],
    }),

    getDefaultPlan: builder.query<ApiResponse<IPlan>, void>({
      query: () => "/plans/default",
      providesTags: [{ type: "Plan", id: "DEFAULT" }],
    }),

    // Admin endpoints
    getAllPlans: builder.query<ApiResponse<PaginatedResponse<IPlan>>, PaginationParams | void>({
      query: (params) => ({
        url: "/plans/admin",
        params: params || {},
      }),
      providesTags: [{ type: "Plan", id: "ADMIN_LIST" }],
    }),

    createPlan: builder.mutation<ApiResponse<IPlan>, CreatePlanRequest>({
      query: (data) => ({
        url: "/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Plan", id: "LIST" }, { type: "Plan", id: "ADMIN_LIST" }],
    }),

    updatePlan: builder.mutation<ApiResponse<IPlan>, { id: string; data: UpdatePlanRequest }>({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Plan", id },
        { type: "Plan", id: "LIST" },
        { type: "Plan", id: "ADMIN_LIST" },
      ],
    }),

    deletePlan: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Plan", id: "LIST" }, { type: "Plan", id: "ADMIN_LIST" }],
    }),

    seedPlans: builder.mutation<ApiResponse<{ seeded: boolean }>, void>({
      query: () => ({
        url: "/plans/seed",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Plan", id: "LIST" }, { type: "Plan", id: "ADMIN_LIST" }],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanQuery,
  useGetPlanBySlugQuery,
  useGetDefaultPlanQuery,
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useSeedPlansMutation,
} = planApi;
