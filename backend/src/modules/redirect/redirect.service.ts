import { Request } from "express";
import { clientUrl } from "../../config/secret";
import { recordClickService } from "../click/click.service";
import { DeviceType, ILocation } from "../click/click.type";
import { getUrlByShortIdService } from "../url/url.service";
import { IUrl } from "../url/url.type";

// Parse user agent to get device info
const parseUserAgent = (
  userAgent?: string
): { type: DeviceType; os?: string; browser?: string } => {
  if (!userAgent) {
    return { type: "desktop" };
  }

  // Determine device type
  let type: DeviceType = "desktop";
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
    if (/iPad|Tablet/i.test(userAgent)) {
      type = "tablet";
    } else {
      type = "mobile";
    }
  }

  // Extract OS
  let os: string | undefined;
  const osMatch = userAgent.match(/\(([^)]+)\)/);
  if (osMatch) {
    const osStr = osMatch[1];
    if (/Windows/i.test(osStr)) os = "Windows";
    else if (/Mac OS X|macOS/i.test(osStr)) os = "macOS";
    else if (/Linux/i.test(osStr)) os = "Linux";
    else if (/Android/i.test(osStr)) os = "Android";
    else if (/iOS|iPhone|iPad/i.test(osStr)) os = "iOS";
    else os = osStr.split(";")[0].trim();
  }

  // Extract browser
  let browser: string | undefined;
  if (/Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    browser = "Safari";
  } else if (/Firefox/i.test(userAgent)) {
    browser = "Firefox";
  } else if (/Edge|Edg/i.test(userAgent)) {
    browser = "Edge";
  } else if (/Opera|OPR/i.test(userAgent)) {
    browser = "Opera";
  } else {
    const browserMatch = userAgent.match(/^([^/]+)/);
    browser = browserMatch ? browserMatch[1] : undefined;
  }

  return { type, os, browser };
};

// Parse IP to get location (placeholder - can be enhanced with geoip service)
const parseLocation = (_ip?: string): ILocation => {
  // Note: To enable geolocation, install geoip-lite: npm install geoip-lite @types/geoip-lite
  // Then uncomment the following:
  // import geoip from "geoip-lite";
  // const geo = geoip.lookup(ip);
  // return {
  //   country: geo?.country,
  //   city: geo?.city,
  //   latitude: geo?.ll?.[0],
  //   longitude: geo?.ll?.[1],
  // };
  return {};
};

// Handle redirect
export const handleRedirectService = async (
  req: Request
): Promise<{ redirectUrl: string; found: boolean }> => {
  const { shortId } = req.params;

  try {
    // Get URL by short ID
    const url = (await getUrlByShortIdService(shortId)) as IUrl;

    // Get IP address
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.ip ||
      req.socket.remoteAddress;

    // Parse user agent
    const userAgent = req.headers["user-agent"];
    const device = parseUserAgent(userAgent);

    // Parse location from IP
    const location = parseLocation(ip);

    // Get referrer
    const referrer = req.headers.referer || req.headers.referrer;

    // Record click asynchronously (don't block redirect)
    recordClickService(url._id.toString(), {
      ipAddress: ip,
      location,
      device,
      referrer: referrer as string | undefined,
    }).catch((err) => {
      console.error("Failed to record click:", err);
    });

    return {
      redirectUrl: url.originalUrl,
      found: true,
    };
  } catch {
    // URL not found or expired, redirect to client 404 page
    return {
      redirectUrl: `${clientUrl}/not-found?shortId=${shortId}`,
      found: false,
    };
  }
};
