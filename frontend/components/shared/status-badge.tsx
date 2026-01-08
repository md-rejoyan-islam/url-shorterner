import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "cancelled"
  | "expired"
  | "past_due"
  | "succeeded"
  | "failed"
  | "refunded";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  cancelled: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  expired: "bg-red-100 text-red-800 hover:bg-red-100",
  past_due: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  succeeded: "bg-green-100 text-green-800 hover:bg-green-100",
  failed: "bg-red-100 text-red-800 hover:bg-red-100",
  refunded: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");
  const style = statusStyles[normalizedStatus] || statusStyles.inactive;

  return (
    <Badge
      variant="secondary"
      className={cn("capitalize font-medium", style, className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
