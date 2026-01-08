import { baseApi } from "./base-api";
import { CreateUrlRequest, IUrl, UpdateUrlRequest, UrlFilters } from "@/types/url";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export interface UrlResponse {
  url: IUrl;
}

export const urlApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUrls: builder.query<ApiResponse<PaginatedResponse<IUrl>>, UrlFilters | void>({
      query: (params) => ({
        url: "/urls",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({ type: "Url" as const, id: _id })),
              { type: "Url", id: "LIST" },
            ]
          : [{ type: "Url", id: "LIST" }],
    }),

    getUrl: builder.query<ApiResponse<UrlResponse>, string>({
      query: (id) => `/urls/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Url", id }],
    }),

    createUrl: builder.mutation<ApiResponse<UrlResponse>, CreateUrlRequest>({
      query: (data) => ({
        url: "/urls",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Url", id: "LIST" }, { type: "Url", id: "SUMMARY" }, "User"],
    }),

    updateUrl: builder.mutation<ApiResponse<UrlResponse>, { id: string; data: UpdateUrlRequest }>({
      query: ({ id, data }) => ({
        url: `/urls/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Url", id },
        { type: "Url", id: "LIST" },
        { type: "Url", id: "SUMMARY" },
      ],
    }),

    deleteUrl: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/urls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Url", id: "LIST" }, { type: "Url", id: "SUMMARY" }, "User"],
    }),

    // Admin endpoints
    getAllUrls: builder.query<ApiResponse<PaginatedResponse<IUrl>>, UrlFilters | void>({
      query: (params) => ({
        url: "/urls/admin/all",
        params: params || {},
      }),
      providesTags: [{ type: "Url", id: "ADMIN_LIST" }],
    }),

    getAnyUrl: builder.query<ApiResponse<UrlResponse>, string>({
      query: (id) => `/urls/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Url", id }],
    }),

    deleteAnyUrl: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/urls/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Url", id: "LIST" }, { type: "Url", id: "ADMIN_LIST" }],
    }),

    // URL Summary endpoint
    getUrlSummary: builder.query<
      ApiResponse<{
        totalLinks: number;
        activeLinks: number;
        inactiveLinks: number;
        totalClicks: number;
        avgClicks: number;
      }>,
      void
    >({
      query: () => "/urls/summary",
      providesTags: [{ type: "Url", id: "SUMMARY" }],
    }),
  }),
});

// Admin URL endpoints
export const adminUrlApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGetUrls: builder.query<ApiResponse<{ urls: IUrl[]; total: number }>, UrlFilters | void>({
      query: (params) => ({
        url: "/admin/urls",
        params: params || {},
      }),
      providesTags: ["Url"],
    }),

    adminUpdateUrl: builder.mutation<ApiResponse<IUrl>, { id: string; data: UpdateUrlRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/urls/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Url", "User"],
    }),

    adminDeleteUrl: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/admin/urls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Url"],
    }),
  }),
});

export const {
  useGetUrlsQuery,
  useGetUrlQuery,
  useCreateUrlMutation,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
  useGetAllUrlsQuery,
  useGetAnyUrlQuery,
  useDeleteAnyUrlMutation,
  useGetUrlSummaryQuery,
} = urlApi;

export const {
  useAdminGetUrlsQuery,
  useAdminUpdateUrlMutation,
  useAdminDeleteUrlMutation,
} = adminUrlApi;
