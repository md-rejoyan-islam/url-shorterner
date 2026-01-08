import { IPlan } from "./plan";
import { IUser } from "./user";

export enum SubscriptionStatus {
  FREE = "free",
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  PENDING = "pending",
  PAST_DUE = "past_due",
}

export enum PaymentProvider {
  STRIPE = "stripe",
  PAYPAL = "paypal",
  MANUAL = "manual",
}

export interface ISubscriptionUsage {
  links: number;
  clicks: number;
}

export interface ISubscription {
  _id: string;
  id: string;
  user: string | IUser;
  plan: string | IPlan;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly" | "lifetime";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string | null;
  paymentProvider?: PaymentProvider | null;
  externalSubscriptionId?: string | null;
  usage?: ISubscriptionUsage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
  billingCycle: "monthly" | "yearly";
}

export interface ChangePlanRequest {
  planId: string;
  billingCycle: "monthly" | "yearly";
}
