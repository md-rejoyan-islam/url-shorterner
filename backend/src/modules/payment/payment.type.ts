import { Document, Model, Types } from "mongoose";

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

export interface IPaymentCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface IPayment {
  user: Types.ObjectId;
  plan: Types.ObjectId;
  subscription?: Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  billingCycle: "monthly" | "yearly" | "lifetime";
  description?: string;
  metadata?: Record<string, string>;
  failureReason?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentDocument extends IPayment, Document {
  _id: Types.ObjectId;
}

export interface IPaymentModel extends Model<IPaymentDocument> {
  findByUser(userId: string): Promise<IPaymentDocument[]>;
  findByStripePaymentIntent(
    paymentIntentId: string
  ): Promise<IPaymentDocument | null>;
  findByStripeSession(sessionId: string): Promise<IPaymentDocument | null>;
}

// Stripe Customer stored in User model extension
export interface IStripeCustomer {
  stripeCustomerId?: string;
  defaultPaymentMethodId?: string;
}

// Request/Response types
export interface ICreateCheckoutSessionInput {
  planId: string;
  billingCycle: "monthly" | "yearly" | "lifetime";
  paymentMethodId?: string; // Use saved card
}

export interface ICheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  amount: number;
  currency: string;
}

export interface ISavedCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface IAddCardInput {
  paymentMethodId: string;
  setAsDefault?: boolean;
}
