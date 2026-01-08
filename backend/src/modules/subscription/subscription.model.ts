import mongoose, { Schema } from "mongoose";
import {
  ISubscriptionDocument,
  ISubscriptionModel,
  PaymentProvider,
  SubscriptionStatus,
} from "./subscription.type";

const subscriptionSchema = new Schema<ISubscriptionDocument, ISubscriptionModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Plan is required"],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "lifetime"],
      required: [true, "Billing cycle is required"],
    },
    currentPeriodStart: {
      type: Date,
      required: [true, "Current period start is required"],
    },
    currentPeriodEnd: {
      type: Date,
      required: [true, "Current period end is required"],
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    paymentProvider: {
      type: String,
      enum: Object.values(PaymentProvider),
      default: null,
    },
    externalSubscriptionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });

// Instance method - check if subscription is expired
subscriptionSchema.methods.isExpired = function (): boolean {
  return this.currentPeriodEnd < new Date();
};

// Instance method - days remaining
subscriptionSchema.methods.daysRemaining = function (): number {
  const now = new Date();
  const end = new Date(this.currentPeriodEnd);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Static method - find active subscription by user
subscriptionSchema.statics.findActiveByUser = async function (
  userId: string
): Promise<ISubscriptionDocument | null> {
  return this.findOne({
    user: userId,
    status: SubscriptionStatus.ACTIVE,
    currentPeriodEnd: { $gt: new Date() },
  }).populate("plan");
};

const Subscription = mongoose.model<ISubscriptionDocument, ISubscriptionModel>(
  "Subscription",
  subscriptionSchema
);

export default Subscription;
