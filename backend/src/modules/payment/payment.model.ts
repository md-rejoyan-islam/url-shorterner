import mongoose, { Schema } from "mongoose";
import {
  IPaymentDocument,
  IPaymentModel,
  PaymentMethod,
  PaymentStatus,
} from "./payment.type";

const paymentSchema = new Schema<IPaymentDocument, IPaymentModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: [true, "Plan is required"],
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "usd",
      lowercase: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.CARD,
    },
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      index: true,
    },
    stripePaymentMethodId: {
      type: String,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "lifetime"],
      required: [true, "Billing cycle is required"],
    },
    description: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
    failureReason: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (stripePaymentIntentId already indexed via index: true in schema)
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Static methods
paymentSchema.statics.findByUser = async function (
  userId: string
): Promise<IPaymentDocument[]> {
  return this.find({ user: userId })
    .populate("plan")
    .sort({ createdAt: -1 });
};

paymentSchema.statics.findByStripePaymentIntent = async function (
  paymentIntentId: string
): Promise<IPaymentDocument | null> {
  return this.findOne({ stripePaymentIntentId: paymentIntentId });
};

paymentSchema.statics.findByStripeSession = async function (
  sessionId: string
): Promise<IPaymentDocument | null> {
  return this.findOne({ stripeSessionId: sessionId });
};

const Payment = mongoose.model<IPaymentDocument, IPaymentModel>(
  "Payment",
  paymentSchema
);

export default Payment;
