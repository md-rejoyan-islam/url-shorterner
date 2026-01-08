export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUserPlan {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  type: string;
}

export interface IUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  urlCount: number;
  isActive: boolean;
  isEmailVerified: boolean;
  currentPlan?: string | IUserPlan | null;
  subscription?: string | null;
  stripeCustomerId?: string | null;
  defaultPaymentMethodId?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface IDevice {
  _id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface IUsage {
  urlsCreated: number;
  urlLimit: number;
  clicksThisMonth: number;
  planName: string;
}
