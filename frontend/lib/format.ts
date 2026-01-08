import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(date: string | Date | undefined | null, formatStr: string = "MMM d, yyyy"): string {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, formatStr);
  } catch {
    return "N/A";
  }
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return "N/A";
    return format(dateObj, "MMM d, yyyy h:mm a");
  } catch {
    return "N/A";
  }
}

export function formatRelativeTime(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return "N/A";
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "N/A";
  }
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) {
    return "0";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + "...";
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getFullShortUrl(shortCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SHORT_URL_BASE || "linkshort.io";
  return `https://${baseUrl}/${shortCode}`;
}
