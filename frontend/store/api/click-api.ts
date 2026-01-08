import { baseApi } from "./base-api";
import { AnalyticsFilters, IAnalytics, IClick } from "@/types/click";
import { ApiResponse } from "@/types/api";

export interface ClicksResponse {
  clicks: IClick[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const clickApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<ApiResponse<IAnalytics>, AnalyticsFilters | void>({
      query: (params) => ({
        url: "/clicks/analytics",
        params: params || {},
      }),
      providesTags: ["Click"],
    }),

    getUrlAnalytics: builder.query<ApiResponse<IAnalytics>, { urlId: string; params?: AnalyticsFilters }>({
      query: ({ urlId, params }) => ({
        url: `/clicks/analytics/${urlId}`,
        params: params || {},
      }),
      providesTags: (_result, _error, { urlId }) => [{ type: "Click", id: urlId }],
    }),

    getUrlClicks: builder.query<ApiResponse<ClicksResponse>, string>({
      query: (urlId) => `/clicks/url/${urlId}`,
      providesTags: (_result, _error, urlId) => [{ type: "Click", id: urlId }],
    }),
  }),
});

// Alias for consistent naming
export const useGetClickStatsQuery = clickApi.endpoints.getAnalytics.useQuery;

export const {
  useGetAnalyticsQuery,
  useGetUrlAnalyticsQuery,
  useGetUrlClicksQuery,
} = clickApi;
