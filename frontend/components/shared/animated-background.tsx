import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  /** Preset variants for different use cases */
  variant?: "hero" | "section" | "cta" | "subtle";
  /** Show gradient orbs */
  showOrbs?: boolean;
  /** Show animated rings */
  showRings?: boolean;
  /** Show grid pattern */
  showGrid?: boolean;
  /** Grid size (e.g., "4rem", "3rem", "2rem") */
  gridSize?: string;
  /** Orb opacity (0-100 for percentage) */
  orbOpacity?: number;
  /** Ring count (1-3) */
  ringCount?: 1 | 2 | 3;
  /** Custom className for additional styling */
  className?: string;
}

export function AnimatedBackground({
  variant = "hero",
  showOrbs = true,
  showRings = true,
  showGrid = true,
  gridSize,
  orbOpacity,
  ringCount,
  className,
}: AnimatedBackgroundProps) {
  // Preset configurations
  const presets = {
    hero: {
      gridSize: "4rem",
      orbOpacity: 15,
      ringCount: 2 as const,
      gridOpacity: "0.03",
    },
    section: {
      gridSize: "3rem",
      orbOpacity: 5,
      ringCount: 2 as const,
      gridOpacity: "0.02",
    },
    cta: {
      gridSize: "4rem",
      orbOpacity: 10,
      ringCount: 3 as const,
      gridOpacity: "0.03",
    },
    subtle: {
      gridSize: "3rem",
      orbOpacity: 5,
      ringCount: 1 as const,
      gridOpacity: "0.02",
    },
  };

  const config = presets[variant];
  const finalGridSize = gridSize || config.gridSize;
  const finalOrbOpacity = orbOpacity ?? config.orbOpacity;
  const finalRingCount = ringCount ?? config.ringCount;
  const finalGridOpacity = config.gridOpacity;

  return (
    <div className={cn("absolute inset-0", className)}>
      {/* Gradient Orbs */}
      {showOrbs && (
        <>
          {variant === "hero" ? (
            <>
              <div
                className={cn(
                  "absolute top-1/4 left-1/4 w-125 h-125 rounded-full blur-3xl animate-pulse",
                  `bg-[#e6560f]/${finalOrbOpacity}`
                )}
              />
              <div
                className={cn(
                  "absolute top-0 right-0 w-100 h-100 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]",
                  `bg-orange-400/${Math.round(finalOrbOpacity * 0.67)}`
                )}
              />
              <div
                className={cn(
                  "absolute bottom-0 left-0 w-75 h-75 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite_0.5s]",
                  `bg-amber-400/${Math.round(finalOrbOpacity * 0.67)}`
                )}
              />
            </>
          ) : variant === "cta" ? (
            <>
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-3xl animate-pulse",
                  `bg-[#e6560f]/${finalOrbOpacity}`
                )}
              />
              <div
                className={cn(
                  "absolute top-0 right-0 w-100 h-100 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]",
                  `bg-[#e6560f]/${Math.round(finalOrbOpacity * 0.8)}`
                )}
              />
              <div
                className={cn(
                  "absolute bottom-0 left-0 w-75 h-75 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite_0.5s]",
                  `bg-orange-400/${finalOrbOpacity}`
                )}
              />
            </>
          ) : (
            <>
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-3xl animate-pulse",
                  `bg-[#e6560f]/${finalOrbOpacity}`
                )}
              />
              <div
                className={cn(
                  "absolute top-0 left-0 w-75 h-75 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]",
                  `bg-orange-400/${finalOrbOpacity}`
                )}
              />
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-100 h-100 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite_0.5s]",
                  `bg-amber-400/${finalOrbOpacity}`
                )}
              />
            </>
          )}
        </>
      )}

      {/* Animated Rings */}
      {showRings && (
        <>
          {finalRingCount >= 1 && (
            <div
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border animate-[ping_4s_ease-out_infinite]",
                variant === "cta"
                  ? "w-75 h-75 border-[#e6560f]/15"
                  : variant === "section"
                  ? "w-50 h-50 border-[#e6560f]/10"
                  : "w-75 h-75 border-[#e6560f]/10"
              )}
            />
          )}
          {finalRingCount >= 2 && (
            <div
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border animate-[ping_4s_ease-out_infinite_1s]",
                variant === "cta"
                  ? "w-125 h-125 border-[#e6560f]/10"
                  : variant === "section"
                  ? "w-100 h-100 border-[#e6560f]/5"
                  : "w-125 h-125 border-[#e6560f]/5"
              )}
            />
          )}
          {finalRingCount >= 3 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full border border-[#e6560f]/5 animate-[ping_4s_ease-out_infinite_2s]" />
          )}
        </>
      )}

      {/* Grid Pattern */}
      {showGrid && (
        <div
          className={cn("absolute inset-0")}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(230, 86, 15, ${finalGridOpacity}) 1px, transparent 1px), linear-gradient(to bottom, rgba(230, 86, 15, ${finalGridOpacity}) 1px, transparent 1px)`,
            backgroundSize: `${finalGridSize} ${finalGridSize}`,
          }}
        />
      )}
    </div>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-linear-to-r from-[#e6560f] via-orange-500 to-amber-500 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}

interface CardBackgroundDecorationProps {
  className?: string;
}

export function CardBackgroundDecoration({
  className,
}: CardBackgroundDecorationProps) {
  return (
    <>
      <div
        className={cn(
          "absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#e6560f]/5 to-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2",
          className
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-orange-400/5 to-amber-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2",
          className
        )}
      />
    </>
  );
}

interface HoverGradientProps {
  className?: string;
}

export function HoverGradient({ className }: HoverGradientProps) {
  return (
    <div
      className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#e6560f]/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        className
      )}
    />
  );
}
