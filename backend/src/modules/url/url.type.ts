import { Document, Types } from "mongoose";

export interface IUrl extends Document {
  _id: Types.ObjectId;
  originalUrl: string;
  shortId: string;
  shortUrl: string;
  qrCodeUrl?: string;
  clickCount: number;
  isActive: boolean;
  expiresAt?: Date;
  user?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUrlMethods {
  isExpired(): boolean;
  incrementClickCount(): Promise<IUrl>;
}

export interface IUrlModel {
  findByShortId(shortId: string): Promise<IUrl | null>;
  findByUser(userId: string, page?: number, limit?: number): Promise<IUrl[]>;
}
