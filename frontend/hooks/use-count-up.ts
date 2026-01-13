"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  enableScrollTrigger?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
  enableScrollTrigger = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  // If scroll trigger is disabled, start immediately
  const [hasStarted, setHasStarted] = useState(!enableScrollTrigger);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // If scroll trigger is disabled, animation starts immediately via initial state
    if (!enableScrollTrigger) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [enableScrollTrigger, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const difference = end - start;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const currentCount = start + difference * easeOutCubic;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, start, end, duration]);

  const formattedValue = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return { count, formattedValue, ref, hasStarted };
}

// Helper function to parse stat values like "10M+", "500M+", "50K+", "99.9%"
export function parseStatValue(value: string): {
  number: number;
  suffix: string;
  decimals: number;
} {
  const match = value.match(/^([\d.]+)([KMB%+]+)?$/i);
  if (!match) {
    return { number: 0, suffix: "", decimals: 0 };
  }

  const numberStr = match[1];
  const suffix = match[2] || "";
  const decimals = numberStr.includes(".") ? numberStr.split(".")[1].length : 0;

  return {
    number: parseFloat(numberStr),
    suffix,
    decimals,
  };
}
