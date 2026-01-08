"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  id?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "button";
  label?: string;
  className?: string;
  duration?: number;
  showOnHover?: boolean;
}

export function CopyButton({
  text,
  id,
  size = "sm",
  variant = "icon",
  label,
  className,
  duration = 2000,
  showOnHover = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, duration);
    } catch {
      // Failed to copy
    }
  }, [text, duration]);

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "gap-2 transition-all",
          copied
            ? "bg-[#e6560f]/10 border-[#e6560f]/30 hover:bg-[#e6560f]/20"
            : "",
          className
        )}
        onClick={handleCopy}
      >
        {copied ? (
          <Check className={cn(iconSizeClasses[size], "text-[#e6560f]")} />
        ) : (
          <Copy className={iconSizeClasses[size]} />
        )}
        {label || "Copy"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        "shrink-0 transition-all",
        copied
          ? "bg-[#e6560f]/10 hover:bg-[#e6560f]/20"
          : "",
        showOnHover && !copied ? "opacity-0 group-hover:opacity-100" : "",
        copied && showOnHover ? "opacity-100" : "",
        className
      )}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className={cn(iconSizeClasses[size], "text-[#e6560f]")} />
      ) : (
        <Copy className={iconSizeClasses[size]} />
      )}
    </Button>
  );
}
