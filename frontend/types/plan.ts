export enum PlanType {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export interface IPlanFeatures {
  urlLimit: number;
  customAliasAllowed: boolean;
  analyticsEnabled: boolean;
  qrCodeEnabled: boolean;
  apiAccessEnabled: boolean;
  maxDevices: number;
  supportLevel: "basic" | "priority" | "dedicated";
  // Admin form features
  customCodes?: boolean;
  analytics?: boolean;
  apiAccess?: boolean;
  prioritySupport?: boolean;
}

export interface IFeatureItem {
  id: string;
  text: string;
  order: number;
}

export interface IPlan {
  _id: string;
  id: string;
  name: string;
  slug: string;
  type: PlanType;
  description: string;
  features: IPlanFeatures;
  featuresList?: IFeatureItem[];
  // Price can be number (simplified) or object (from server)
  price: number | { monthly: number; yearly: number };
  interval?: "month" | "year";
  maxLinks: number;
  maxClicks: number;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  _count?: {
    subscriptions: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Full schema create request (original)
export interface CreatePlanRequestFull {
  name: string;
  slug: string;
  type: PlanType;
  description: string;
  features: IPlanFeatures;
  price: {
    monthly: number;
    yearly: number;
  };
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}

// Simplified admin form features
export interface AdminPlanFeatures {
  customCodes?: boolean;
  analytics?: boolean;
  apiAccess?: boolean;
  prioritySupport?: boolean;
}

// Simplified admin form create request
export interface CreatePlanRequest {
  name: string;
  description?: string;
  price: number;
  interval: "month" | "year";
  maxLinks: number;
  maxClicks: number;
  isActive: boolean;
  features?: AdminPlanFeatures;
  featuresList?: IFeatureItem[];
}

// Update request supports both formats
export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  price?: number;
  interval?: "month" | "year";
  maxLinks?: number;
  maxClicks?: number;
  isActive?: boolean;
  features?: AdminPlanFeatures;
  featuresList?: IFeatureItem[];
}
