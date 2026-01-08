import { cn } from "@/lib/utils";
import { Link2 } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xs";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xs: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xs: "text-sm",
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-[#e6560f] to-orange-500 rounded-lg blur-sm opacity-75" />
        <div className="relative bg-linear-to-r from-[#e6560f] to-orange-500 p-2 rounded-lg">
          <Link2 className={cn("text-white", sizes[size])} />
        </div>
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold bg-linear-to-r from-[#e6560f] to-orange-500 bg-clip-text text-transparent",
            textSizes[size]
          )}
        >
          LinkShort
        </span>
      )}
    </Link>
  );
}
