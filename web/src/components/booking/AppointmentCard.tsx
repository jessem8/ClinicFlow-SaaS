import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, Clock, User, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "no_show" | "attended";

interface AppointmentCardProps {
  id: string;
  patientName: string;
  patientPhone: string;
  datetime: Date;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
  onViewDetails?: (id: string) => void;
  compact?: boolean;
}

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  no_show: "Absent",
  attended: "Effectué",
};

const statusVariants: Record<AppointmentStatus, "pending" | "confirmed" | "cancelled" | "no-show" | "attended"> = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
  no_show: "no-show",
  attended: "attended",
};

export function AppointmentCard({
  id,
  patientName,
  patientPhone,
  datetime,
  duration,
  status,
  notes,
  onStatusChange,
  onViewDetails,
  compact = false,
}: AppointmentCardProps) {
  const isPast = datetime < new Date();
  const canModify = !["cancelled", "attended", "no_show"].includes(status);

  return (
    <Card 
      variant="interactive" 
      className={cn(
        "transition-all",
        isPast && status !== "attended" && "opacity-70"
      )}
      onClick={() => onViewDetails?.(id)}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Time & Date */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                <span>{format(datetime, "HH:mm", { locale: fr })}</span>
              </div>
              {!compact && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{format(datetime, "d MMM", { locale: fr })}</span>
                </div>
              )}
              <Badge variant={statusVariants[status]} className="ml-auto">
                {statusLabels[status]}
              </Badge>
            </div>

            {/* Patient Info */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{patientName}</p>
                <p className="text-xs text-muted-foreground">{patientPhone}</p>
              </div>
            </div>

            {/* Notes */}
            {notes && !compact && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {notes}
              </p>
            )}
          </div>

          {/* Actions */}
          {canModify && onStatusChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {status === "pending" && (
                  <DropdownMenuItem onClick={() => onStatusChange(id, "confirmed")}>
                    Confirmer
                  </DropdownMenuItem>
                )}
                {status === "confirmed" && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(id, "attended")}>
                      Marquer effectué
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(id, "no_show")}>
                      Marquer absent
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem 
                  onClick={() => onStatusChange(id, "cancelled")}
                  className="text-destructive"
                >
                  Annuler
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
