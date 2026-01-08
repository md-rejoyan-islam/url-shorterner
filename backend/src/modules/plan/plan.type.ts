import { Document, Model, Types } from "mongoose";

export enum PlanType {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export enum BillingCycle {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  LIFETIME = "lifetime",
}

export interface IPlanFeatures {
  urlLimit: number; // -1 for unlimited
  customAliasAllowed: boolean;
  analyticsEnabled: boolean;
  qrCodeEnabled: boolean;
  apiAccessEnabled: boolean;
  maxDevices: number;
  supportLevel: "basic" | "priority" | "dedicated";
  // Admin form features (simplified)
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
  name: string;
  slug: string;
  type: PlanType;
  description: string;
  features: IPlanFeatures;
  featuresList?: IFeatureItem[];
  price: {
    monthly: number;
    yearly: number;
  };
  // Simplified admin form fields
  maxLinks?: number;
  maxClicks?: number;
  interval?: "month" | "year";
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlanDocument extends IPlan, Document {
  _id: Types.ObjectId;
}

export interface IPlanModel extends Model<IPlanDocument> {
  findDefaultPlan(): Promise<IPlanDocument | null>;
  isSlugTaken(slug: string, excludePlanId?: string): Promise<boolean>;
}
