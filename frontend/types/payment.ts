import { IPlan } from "./plan";
import { ISubscription } from "./subscription";
import { IUser } from "./user";

export enum PaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
}

export interface IPayment {
  _id: string;
  id: string;
  user: string | IUser;
  plan: string | IPlan;
  subscription?: string | ISubscription;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  billingCycle: "monthly" | "yearly" | "lifetime";
  description?: string;
  metadata?: Record<string, string>;
  failureReason?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISavedCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface CreateCheckoutRequest {
  planId: string;
  billingCycle: "monthly" | "yearly";
  paymentMethodId?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  amount: number;
  currency: string;
}

export interface AddCardRequest {
  paymentMethodId: string;
  setAsDefault?: boolean;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
}
