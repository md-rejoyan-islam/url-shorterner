"use client";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { formatDate } from "@/lib/format";
import type { Url } from "@/types";
import { BarChart2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface RecentLinksProps {
  urls: Url[];
}

export function RecentLinks({ urls }: RecentLinksProps) {
  return (
    <div className="space-y-4">
      {urls.map((url) => {
        return (
          <div
            key={url.id}
            className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate text-primary">
                  {url.shortUrl}
                </span>
                <CopyButton text={url.shortUrl} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {url.originalUrl}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{url.clickCount} clicks</span>
                <span>{formatDate(url.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href={`/dashboard/urls/${url._id}/analytics`}>
                  <BarChart2 className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
