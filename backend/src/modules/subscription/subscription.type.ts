import { Document, Model, Types } from "mongoose";

export enum SubscriptionStatus {
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

export interface ISubscription {
  user: Types.ObjectId;
  plan: Types.ObjectId;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly" | "lifetime";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  paymentProvider?: PaymentProvider;
  externalSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends ISubscription, Document {
  _id: Types.ObjectId;
  isExpired(): boolean;
  daysRemaining(): number;
}

export interface ISubscriptionModel extends Model<ISubscriptionDocument> {
  findActiveByUser(userId: string): Promise<ISubscriptionDocument | null>;
}
