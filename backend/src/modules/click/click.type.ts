import { Document, Types } from "mongoose";

export type DeviceType = "mobile" | "desktop" | "tablet";

export interface ILocation {
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface IDevice {
  type: DeviceType;
  os?: string;
  browser?: string;
}

export interface IClick extends Document {
  _id: Types.ObjectId;
  url: Types.ObjectId;
  user?: Types.ObjectId;
  timestamp: Date;
  location: ILocation;
  device: IDevice;
  ipAddress?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClickModel {
  findByUrl(urlId: string): Promise<IClick[]>;
  countByUrl(urlId: string): Promise<number>;
}

export interface IAnalytics {
  totalClicks: number;
  todayClicks: number;
  yesterdayClicks: number;
  lastMonthClicks: number;
  totalLinks: number;
  linksThisWeek: number;
  linksLastWeek: number;
  activeLinks: number;
  avgClickRate: number;
  topLink: { shortUrl: string; clickCount: number } | null;
  countryStats: { name: string; value: number }[];
  deviceStats: { name: string; value: number }[];
  browserStats: { name: string; value: number }[];
  dailyClicks: { date: string; clicks: number }[];
  activePercentage: number;
  percentageChange: number;
  linksTrend: number;
  todayClicksTrend: number;
}
