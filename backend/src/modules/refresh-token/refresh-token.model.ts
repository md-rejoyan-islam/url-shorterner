import mongoose, { Schema } from "mongoose";
import {
  IRefreshTokenDocument,
  IRefreshTokenModel,
} from "./refresh-token.type";

const deviceInfoSchema = new Schema(
  {
    deviceName: {
      type: String,
      required: true,
      trim: true,
    },
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: {
      type: String,
      trim: true,
    },
    os: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const refreshTokenSchema = new Schema<
  IRefreshTokenDocument,
  IRefreshTokenModel
>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deviceInfo: {
      type: deviceInfoSchema,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
refreshTokenSchema.index({ user: 1, isRevoked: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Instance method - check if token is expired
refreshTokenSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

// Instance method - check if token is valid
refreshTokenSchema.methods.isValid = function (): boolean {
  return !this.isRevoked && !this.isExpired();
};

// Static method - count active tokens by user
refreshTokenSchema.statics.countActiveByUser = async function (
  userId: string
): Promise<number> {
  return this.countDocuments({
    user: userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
};

// Static method - find valid token
refreshTokenSchema.statics.findValidToken = async function (
  token: string
): Promise<IRefreshTokenDocument | null> {
  return this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
};

// Static method - delete all tokens by user (logout all devices)
refreshTokenSchema.statics.revokeAllByUser = async function (
  userId: string
): Promise<void> {
  await this.deleteMany({ user: userId });
};

// Static method - delete token by device ID
refreshTokenSchema.statics.revokeByDevice = async function (
  userId: string,
  deviceId: string
): Promise<void> {
  await this.deleteOne({ _id: deviceId, user: userId });
};

// Static method - get active devices for user
refreshTokenSchema.statics.getActiveDevices = async function (
  userId: string
): Promise<IRefreshTokenDocument[]> {
  return this.find({
    user: userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  })
    .select("deviceInfo lastUsedAt createdAt _id")
    .sort({ lastUsedAt: -1 });
};

const RefreshToken = mongoose.model<IRefreshTokenDocument, IRefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
