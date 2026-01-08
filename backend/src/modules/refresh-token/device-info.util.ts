import { Request } from "express";
import { UAParser } from "ua-parser-js";
import { DeviceType, IDeviceInfo } from "./refresh-token.type";

export const extractDeviceInfo = (req: Request): IDeviceInfo => {
  const userAgent = req.headers["user-agent"] || "";
  const parser = UAParser(userAgent);
  const result = parser;

  // Determine device type
  let deviceType: DeviceType = "unknown";
  const device = result.device.type;
  if (device === "mobile") deviceType = "mobile";
  else if (device === "tablet") deviceType = "tablet";
  else if (!device) deviceType = "desktop"; // No device type usually means desktop

  // Generate device name
  const browserName = result.browser.name || "Unknown";
  const osName = result.os.name || "Unknown";
  const deviceName = `${browserName} on ${osName}`;

  // Get IP address
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    "Unknown";

  return {
    deviceName,
    deviceType,
    browser: browserName,
    os: `${osName} ${result.os.version || ""}`.trim(),
    ipAddress,
  };
};
