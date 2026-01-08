export const AUTH_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const PLAN_FEATURES = {
  free: {
    urlLimit: 100,
    customAlias: false,
    analytics: false,
    qrCode: false,
    apiAccess: false,
    maxDevices: 1,
    support: "Basic",
  },
  basic: {
    urlLimit: 1000,
    customAlias: true,
    analytics: true,
    qrCode: true,
    apiAccess: false,
    maxDevices: 2,
    support: "Basic",
  },
  pro: {
    urlLimit: 10000,
    customAlias: true,
    analytics: true,
    qrCode: true,
    apiAccess: true,
    maxDevices: 5,
    support: "Priority",
  },
  enterprise: {
    urlLimit: -1,
    customAlias: true,
    analytics: true,
    qrCode: true,
    apiAccess: true,
    maxDevices: -1,
    support: "Dedicated",
  },
};

export const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  cancelled: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
  pending: "bg-blue-100 text-blue-800",
  past_due: "bg-orange-100 text-orange-800",
  succeeded: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

export const DEVICE_ICONS = {
  desktop: "Monitor",
  mobile: "Smartphone",
  tablet: "Tablet",
};

export const CHART_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#6366F1",
];
