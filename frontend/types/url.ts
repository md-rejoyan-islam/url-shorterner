export interface IUrl {
  _id: string;
  id: string;
  originalUrl: string;
  shortId: string;
  shortUrl: string;
  qrCodeUrl?: string;
  clickCount: number;
  isActive: boolean;
  expiresAt?: string | null;
  user: string | { firstName?: string; lastName?: string; email?: string };
  createdAt: string;
  updatedAt: string;
}

// Alias for convenience
export type Url = IUrl;

export interface CreateUrlRequest {
  originalUrl: string;
  customCode?: string;
  customAlias?: string;
  isActive?: boolean;
  expiresAt?: string;
}

export interface UpdateUrlRequest {
  originalUrl?: string;
  customCode?: string;
  isActive?: boolean;
  expiresAt?: string | null;
}

export interface UrlFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
