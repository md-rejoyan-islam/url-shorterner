import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { handleRedirectService } from "./redirect.service";

// Handle redirect
export const handleRedirect = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await handleRedirectService(req);

    // Prevent browser caching of redirects - important for URL activation/deactivation
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });

    // Always use 302 (temporary redirect) to prevent browser caching
    // This ensures deactivated URLs can be reactivated and work immediately
    res.redirect(302, result.redirectUrl);
  }
);
