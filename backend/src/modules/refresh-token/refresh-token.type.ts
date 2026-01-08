import { Document, Model, Types } from "mongoose";

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export interface IDeviceInfo {
  deviceName: string;
  deviceType: DeviceType;
  browser: string;
  os: string;
  ipAddress: string;
}

export interface IRefreshToken {
  token: string;
  user: Types.ObjectId;
  deviceInfo: IDeviceInfo;
  isRevoked: boolean;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {
  isExpired(): boolean;
  isValid(): boolean;
}

export interface IRefreshTokenModel extends Model<IRefreshTokenDocument> {
  countActiveByUser(userId: string): Promise<number>;
  findValidToken(token: string): Promise<IRefreshTokenDocument | null>;
  revokeAllByUser(userId: string): Promise<void>;
  revokeByDevice(userId: string, deviceId: string): Promise<void>;
  getActiveDevices(userId: string): Promise<IRefreshTokenDocument[]>;
}
