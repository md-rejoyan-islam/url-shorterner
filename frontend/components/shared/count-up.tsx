"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProps {
  value: string; // e.g., "10M+", "500M+", "50K+", "99.9%", "50,000+"
  duration?: number;
  className?: string;
}

export function CountUp({ value, duration = 2000, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const animationRef = useRef<number | null>(null);

  const formatNumber = useCallback(
    (num: number, decimals: number, useCommas: boolean) => {
      const fixed = num.toFixed(decimals);
      if (useCommas) {
        const parts = fixed.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      }
      return fixed;
    },
    []
  );

  const startAnimation = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const { number, suffix, decimals, useCommas } = parseValue(value);
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-expo for smoother feel)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentCount = number * easeOutExpo;

      if (element) {
        element.textContent = `${formatNumber(
          currentCount,
          decimals,
          useCommas
        )}${suffix}`;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (element) {
        element.textContent = value;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [value, duration, formatNumber]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial value
    const { suffix } = parseValue(value);
    element.textContent = `0${suffix}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            startAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, startAnimation]);

  return <span ref={ref} className={cn(className)} />;
}

function parseValue(value: string): {
  number: number;
  suffix: string;
  decimals: number;
  useCommas: boolean;
} {
  // Match patterns like "10M+", "500M+", "50K+", "99.9%", "50,000+"
  const match = value.match(/^([\d,.]+)(.*)$/);
  if (!match) {
    return { number: 0, suffix: "", decimals: 0, useCommas: false };
  }

  const numberStr = match[1];
  const suffix = match[2] || "";
  const useCommas = numberStr.includes(",");
  const cleanNumber = numberStr.replace(/,/g, "");
  const decimals = cleanNumber.includes(".")
    ? cleanNumber.split(".")[1].length
    : 0;

  return {
    number: parseFloat(cleanNumber),
    suffix,
    decimals,
    useCommas,
  };
}
