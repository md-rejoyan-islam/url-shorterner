import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileX, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const isActionObject =
    action &&
    typeof action === "object" &&
    "label" in action &&
    "onClick" in action;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action &&
        (isActionObject ? (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        ) : (
          action
        ))}
    </div>
  );
}
