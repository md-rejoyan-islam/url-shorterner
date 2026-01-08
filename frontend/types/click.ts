export interface IClick {
  _id: string;
  url: string;
  user?: string | null;
  timestamp: string;
  location: {
    country?: string | null;
    city?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  device: {
    type: "mobile" | "desktop" | "tablet";
    os?: string | null;
    browser?: string | null;
  };
  ipAddress?: string | null;
  referrer?: string | null;
  createdAt: string;
  updatedAt: string;
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
  topLink?: {
    shortUrl: string;
    clickCount: number;
  };
  countryStats: Array<{
    name: string;
    value: number;
  }>;
  deviceStats: Array<{
    name: string;
    value: number;
  }>;
  browserStats: Array<{
    name: string;
    value: number;
  }>;
  dailyClicks: Array<{
    date: string;
    clicks: number;
  }>;
  activePercentage: number;
  percentageChange: number;
  linksTrend: number;
  todayClicksTrend: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  urlId?: string;
  days?: number;
}
