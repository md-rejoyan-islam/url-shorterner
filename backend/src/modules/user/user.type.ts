import { Document, Model, Types } from "mongoose";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  urlCount: number;
  isActive: boolean;
  isEmailVerified: boolean;
  currentPlan?: Types.ObjectId;
  subscription?: Types.ObjectId;
  stripeCustomerId?: string;
  defaultPaymentMethodId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  fullName: string; // Virtual field
  comparePassword(password: string): Promise<boolean>;
  canCreateUrl(urlLimit: number): boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}
