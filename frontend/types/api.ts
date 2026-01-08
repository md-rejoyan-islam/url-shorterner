export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  payload?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  urls?: T[];
  users?: T[];
  plans?: T[];
  subscriptions?: T[];
  payments?: T[];
  clicks?: T[];
  total?: number;
  totalRevenue?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiError {
  status: number;
  data: {
    success: boolean;
    statusCode?: number;
    message?: string;
    error?: {
      status: number;
      message: string;
    };
    errors?: Record<string, string[]>;
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as ApiError).data === "object"
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    // Handle nested error structure: { success: false, error: { status, message } }
    if (error.data.error?.message) {
      return error.data.error.message;
    }
    // Handle flat structure: { success: false, message: "..." }
    if (error.data.message) {
      return error.data.message;
    }
    // Handle validation errors array: { errors: [{ path, message }] }
    if (error.data.errors && Array.isArray(error.data.errors)) {
      const firstError = error.data.errors[0] as { path?: string; message?: string } | undefined;
      if (firstError?.message) {
        return firstError.message;
      }
    }
  }
  return fallback;
}
