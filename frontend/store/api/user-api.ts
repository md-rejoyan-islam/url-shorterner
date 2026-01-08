import { baseApi } from "./base-api";
import { IUser } from "@/types/user";
import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";

interface UserFilters extends PaginationParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<PaginatedResponse<IUser>>, UserFilters | void>({
      query: (params) => ({
        url: "/users",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({ type: "User" as const, id: _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUser: builder.query<ApiResponse<IUser>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<ApiResponse<IUser>, CreateUserData>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation<ApiResponse<IUser>, { id: string; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

// Admin endpoints
export const adminUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGetUsers: builder.query<ApiResponse<{ users: IUser[]; total: number }>, UserFilters | void>({
      query: (params) => ({
        url: "/admin/users",
        params: params || {},
      }),
      providesTags: ["User"],
    }),

    adminGetStats: builder.query<ApiResponse<any>, void>({
      query: () => "/admin/stats",
    }),

    adminGetUserDetails: builder.query<ApiResponse<any>, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    adminUpdateUser: builder.mutation<ApiResponse<IUser>, { id: string; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    adminDeleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

export const {
  useAdminGetUsersQuery,
  useAdminGetStatsQuery,
  useAdminGetUserDetailsQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
} = adminUserApi;
