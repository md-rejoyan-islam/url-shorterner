"use client";

import { useState, useCallback } from "react";

export function useCopy(duration: number = 2000) {
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, id?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (id) setCopiedId(id);
        setTimeout(() => {
          setCopied(false);
          setCopiedId(null);
        }, duration);
        return true;
      } catch {
        return false;
      }
    },
    [duration]
  );

  return { copied, copiedId, copy };
}
