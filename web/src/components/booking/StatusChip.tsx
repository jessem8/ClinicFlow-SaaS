import { cn } from "@/lib/utils";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "no_show" | "attended";

interface StatusChipProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "status-pending",
  },
  confirmed: {
    label: "Confirmé",
    className: "status-confirmed",
  },
  cancelled: {
    label: "Annulé",
    className: "status-cancelled",
  },
  no_show: {
    label: "Absent",
    className: "status-no-show",
  },
  attended: {
    label: "Effectué",
    className: "status-attended",
  },
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
