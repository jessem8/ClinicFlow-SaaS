import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Edit2,
  Save,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface PatientVisit {
  id: string;
  date: Date;
  status: "attended" | "no_show" | "cancelled";
  notes?: string;
}

interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  lastVisit: Date;
  totalVisits: number;
  notes?: string;
  visits?: PatientVisit[];
}

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (patient: Patient) => void;
}

const mockVisits: PatientVisit[] = [
  { id: "1", date: new Date(2024, 0, 15), status: "attended", notes: "Consultation régulière" },
  { id: "2", date: new Date(2023, 11, 20), status: "attended" },
  { id: "3", date: new Date(2023, 10, 5), status: "no_show" },
  { id: "4", date: new Date(2023, 9, 12), status: "attended", notes: "Suivi tension" },
];

const statusLabels: Record<string, { label: string; variant: "attended" | "no-show" | "cancelled" }> = {
  attended: { label: "Effectué", variant: "attended" },
  no_show: { label: "Absent", variant: "no-show" },
  cancelled: { label: "Annulé", variant: "cancelled" },
};

export function PatientDetailModal({
  patient,
  isOpen,
  onClose,
  onSave,
}: PatientDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);

  if (!patient) return null;

  const currentPatient = editedPatient || patient;
  const visits = mockVisits;

  const handleEdit = () => {
    setEditedPatient({ ...patient });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedPatient(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedPatient) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      onSave?.(editedPatient);
      setIsEditing(false);
      setEditedPatient(null);
      toast.success("Patient mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof Patient, value: string) => {
    if (!editedPatient) return;
    setEditedPatient({ ...editedPatient, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <span className="block">{patient.fullName}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {patient.totalVisits} visite{patient.totalVisits > 1 ? "s" : ""}
              </span>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Modifier
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Détails du patient {patient.fullName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 py-2 pr-4">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Coordonnées
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <Phone className="h-5 w-5 text-primary" />
                  {isEditing ? (
                    <Input
                      value={currentPatient.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <a 
                        href={`tel:${patient.phone}`} 
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {patient.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <Mail className="h-5 w-5 text-primary" />
                  {isEditing ? (
                    <Input
                      value={currentPatient.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="email@exemple.com"
                      className="h-8"
                    />
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {patient.email || "Non renseigné"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Notes
                </h3>
              </div>
              
              {isEditing ? (
                <Textarea
                  value={currentPatient.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Ajouter des notes sur ce patient..."
                  className="min-h-[80px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {patient.notes || "Aucune note"}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Enregistrer
                </Button>
              </div>
            )}

            <Separator />

            {/* Visit History */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Historique des visites
                </h3>
              </div>

              <div className="space-y-2">
                {visits.map((visit) => {
                  const status = statusLabels[visit.status];
                  return (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {format(visit.date, "d MMMM yyyy", { locale: fr })}
                          </p>
                          {visit.notes && (
                            <p className="text-xs text-muted-foreground">{visit.notes}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
