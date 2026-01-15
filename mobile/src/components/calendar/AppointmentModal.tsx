import { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  FileText,
  CheckCircle,
  XCircle,
  UserX,
  Loader2,
  CalendarClock,
  MessageSquare,
  Send,
  Star
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CalendarAppointment } from "./CalendarGrid";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "no_show" | "attended";

interface AppointmentModalProps {
  appointment: CalendarAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<void>;
  onNotesChange: (id: string, notes: string) => Promise<void>;
}

const statusConfig: Record<AppointmentStatus, { 
  label: string; 
  variant: "pending" | "confirmed" | "cancelled" | "no-show" | "attended";
  description: string;
}> = {
  pending: { 
    label: "En attente de confirmation", 
    variant: "pending",
    description: "Le patient n'a pas encore confirmé"
  },
  confirmed: { 
    label: "Confirmé", 
    variant: "confirmed",
    description: "Le patient a confirmé sa présence"
  },
  cancelled: { 
    label: "Annulé", 
    variant: "cancelled",
    description: "Le rendez-vous a été annulé"
  },
  no_show: { 
    label: "Absence", 
    variant: "no-show",
    description: "Le patient ne s'est pas présenté"
  },
  attended: { 
    label: "Consultation effectuée", 
    variant: "attended",
    description: "La consultation a eu lieu"
  },
};

const statusActions: { 
  status: AppointmentStatus; 
  label: string; 
  icon: React.ElementType;
  variant: "default" | "secondary" | "destructive" | "outline";
  showFor: AppointmentStatus[];
}[] = [
  { 
    status: "confirmed", 
    label: "Confirmer", 
    icon: CheckCircle,
    variant: "default",
    showFor: ["pending"]
  },
  { 
    status: "attended", 
    label: "Marquer effectué", 
    icon: CheckCircle,
    variant: "default",
    showFor: ["confirmed"]
  },
  { 
    status: "no_show", 
    label: "Marquer absent", 
    icon: UserX,
    variant: "secondary",
    showFor: ["confirmed"]
  },
  { 
    status: "cancelled", 
    label: "Annuler", 
    icon: XCircle,
    variant: "destructive",
    showFor: ["pending", "confirmed"]
  },
];

// Mock messages log
const mockMessages = [
  { id: "1", type: "confirmation", sentAt: new Date(Date.now() - 86400000), status: "delivered" },
  { id: "2", type: "reminder_24h", sentAt: new Date(Date.now() - 3600000), status: "delivered" },
];

export function AppointmentModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  onNotesChange,
}: AppointmentModalProps) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState<AppointmentStatus | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (appointment) {
      setNotes(appointment.notes || "");
      setHasChanges(false);
    }
  }, [appointment]);

  if (!appointment) return null;

  const datetime = new Date(appointment.datetime);
  const endTime = addMinutes(datetime, appointment.duration);
  const config = statusConfig[appointment.status];
  const availableActions = statusActions.filter(
    action => action.showFor.includes(appointment.status)
  );
  const isFinalStatus = ["cancelled", "attended", "no_show"].includes(appointment.status);
  const showReviewButton = appointment.status === "attended";

  const handleStatusChange = async (status: AppointmentStatus) => {
    setSavingStatus(status);
    try {
      await onStatusChange(appointment.id, status);
    } finally {
      setSavingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      await onNotesChange(appointment.id, notes);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendReviewRequest = () => {
    toast.success("Demande d'avis envoyée au patient");
  };

  const handleWhatsApp = () => {
    const phone = appointment.patientPhone.replace(/\s/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${appointment.patientPhone}`, "_self");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <span className="block text-lg">{appointment.patientName}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Gérer le rendez-vous de {appointment.patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Quick Contact Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4" />
              Appeler
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2 text-success border-success/30 hover:bg-success/10"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          {/* Status Actions */}
          {!isFinalStatus && availableActions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Actions rapides</p>
              <div className="flex flex-wrap gap-2">
                {availableActions.map((action) => (
                  <Button
                    key={action.status}
                    variant={action.variant}
                    size="sm"
                    onClick={() => handleStatusChange(action.status)}
                    disabled={savingStatus !== null}
                    className="gap-2"
                  >
                    {savingStatus === action.status ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <action.icon className="h-4 w-4" />
                    )}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Send Review Request for Attended */}
          {showReviewButton && (
            <Button 
              variant="outline" 
              className="w-full gap-2 border-warning/30 text-warning hover:bg-warning/10"
              onClick={handleSendReviewRequest}
            >
              <Star className="h-4 w-4" />
              Demander un avis Google
            </Button>
          )}

          <Separator />

          {/* Date & Time */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium">
                  {format(datetime, "EEEE d MMMM", { locale: fr })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Horaire</p>
                <p className="text-sm font-medium">
                  {format(datetime, "HH:mm")} - {format(endTime, "HH:mm")}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Téléphone</p>
              <p className="text-sm font-medium">{appointment.patientPhone}</p>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Notes</label>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Ajouter des notes sur ce rendez-vous..."
              className="min-h-[80px] resize-none"
            />
            {hasChanges && (
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="w-full gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les notes"
                )}
              </Button>
            )}
          </div>

          {/* Messages Log */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Messages envoyés</label>
            </div>
            <div className="space-y-2">
              {mockMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
                >
                  <span className="text-muted-foreground">
                    {msg.type === "confirmation" ? "Confirmation" : "Rappel 24h"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(msg.sentAt, "d MMM HH:mm", { locale: fr })}
                    </span>
                    <Badge variant="confirmed" className="text-[10px]">
                      Envoyé
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reschedule placeholder */}
          {!isFinalStatus && (
            <Button 
              variant="outline" 
              className="w-full gap-2"
              disabled
            >
              <CalendarClock className="h-4 w-4" />
              Reprogrammer (bientôt)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
