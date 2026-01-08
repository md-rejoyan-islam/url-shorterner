import mongoose, { Model, Schema } from "mongoose";
import { qrGeneratorUrl, serverUrl } from "../../config/secret";
import { IUrl, IUrlMethods, IUrlModel } from "./url.type";

type UrlModel = Model<IUrl, object, IUrlMethods> & IUrlModel;

const urlSchema = new Schema<IUrl, UrlModel, IUrlMethods>(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
    },
    shortId: {
      type: String,
      required: [true, "Short ID is required"],
      unique: true,
      minlength: [3, "Short ID must be at least 3 characters long"],
    },
    shortUrl: {
      type: String,
      required: [true, "Short URL is required"],
      unique: true,
    },
    qrCodeUrl: {
      type: String,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries (shortId already indexed via unique: true)
urlSchema.index({ user: 1, createdAt: -1 });

// Pre save hook to generate qr code url
urlSchema.pre("save", async function () {
  if (this.isNew || this.isModified("shortId")) {
    this.qrCodeUrl = `${qrGeneratorUrl}${serverUrl}/${this.shortId}`;
  }
});

// Instance method: Check if URL is expired
urlSchema.methods.isExpired = function (): boolean {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Instance method: Increment click count
urlSchema.methods.incrementClickCount = async function () {
  this.clickCount += 1;
  return this.save();
};

// Static method: Find by short ID
urlSchema.statics.findByShortId = async function (
  shortId: string
): Promise<IUrl | null> {
  return this.findOne({ shortId, isActive: true });
};

// Static method: Find URLs by user
urlSchema.statics.findByUser = async function (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<IUrl[]> {
  const skip = (page - 1) * limit;
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const Url = mongoose.model<IUrl, UrlModel>("Url", urlSchema);

export default Url;
