import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type Status = "ok" | "in_scadenza" | "scaduto";

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle; className: string }> = {
  ok: {
    label: "In Regola",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  in_scadenza: {
    label: "In Scadenza",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  scaduto: {
    label: "Scaduto",
    icon: XCircle,
    className: "bg-danger/10 text-danger border-danger/20",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
