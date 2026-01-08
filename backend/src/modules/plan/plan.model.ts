import mongoose, { Schema } from "mongoose";
import {
  BillingCycle,
  IPlanDocument,
  IPlanModel,
  PlanType,
} from "./plan.type";

const planFeaturesSchema = new Schema(
  {
    urlLimit: {
      type: Number,
      required: true,
      default: 100,
    },
    customAliasAllowed: {
      type: Boolean,
      default: false,
    },
    analyticsEnabled: {
      type: Boolean,
      default: false,
    },
    qrCodeEnabled: {
      type: Boolean,
      default: false,
    },
    apiAccessEnabled: {
      type: Boolean,
      default: false,
    },
    maxDevices: {
      type: Number,
      default: 1,
    },
    supportLevel: {
      type: String,
      enum: ["basic", "priority", "dedicated"],
      default: "basic",
    },
    // Admin form features (simplified)
    customCodes: {
      type: Boolean,
      default: false,
    },
    analytics: {
      type: Boolean,
      default: false,
    },
    apiAccess: {
      type: Boolean,
      default: false,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const featureItemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const planSchema = new Schema<IPlanDocument, IPlanModel>(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      maxlength: [50, "Plan name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      required: [true, "Plan slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: Object.values(PlanType),
      required: [true, "Plan type is required"],
    },
    description: {
      type: String,
      required: [true, "Plan description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    features: {
      type: planFeaturesSchema,
      required: true,
    },
    featuresList: {
      type: [featureItemSchema],
      default: [],
    },
    price: {
      monthly: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      yearly: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
    },
    // Simplified admin form fields
    maxLinks: {
      type: Number,
      default: 100,
    },
    maxClicks: {
      type: Number,
      default: 10000,
    },
    interval: {
      type: String,
      enum: ["month", "year"],
      default: "month",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
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

// Indexes (slug already indexed via unique: true)
planSchema.index({ type: 1 });
planSchema.index({ isActive: 1 });
planSchema.index({ isDefault: 1 });
planSchema.index({ sortOrder: 1 });

// Ensure only one default plan
planSchema.pre("save", async function () {
  if (this.isDefault && this.isModified("isDefault")) {
    await Plan.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    );
  }
});

// Static method - find default plan
planSchema.statics.findDefaultPlan = async function (): Promise<IPlanDocument | null> {
  return this.findOne({ isDefault: true, isActive: true });
};

// Static method - check if slug is taken
planSchema.statics.isSlugTaken = async function (
  slug: string,
  excludePlanId?: string
): Promise<boolean> {
  const plan = await this.findOne({ slug, _id: { $ne: excludePlanId } });
  return !!plan;
};

const Plan = mongoose.model<IPlanDocument, IPlanModel>("Plan", planSchema);

// Export BillingCycle for use in other modules
export { BillingCycle };
export default Plan;
