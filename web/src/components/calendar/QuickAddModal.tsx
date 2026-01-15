import { useState, useMemo } from "react";
import { format, addDays, setHours, setMinutes, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { User, Phone, Calendar, Clock, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    patientName: string;
    patientPhone: string;
    datetime: Date;
  }) => Promise<void>;
  existingAppointments?: { datetime: Date }[];
}

// Generate next 14 days
const generateDateOptions = () => {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    if (date.getDay() !== 0) { // Skip Sundays
      dates.push(startOfDay(date));
    }
  }
  return dates;
};

// Generate time slots for a day
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 8; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

export function QuickAddModal({
  isOpen,
  onClose,
  onSubmit,
  existingAppointments = [],
}: QuickAddModalProps) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dateOptions = useMemo(() => generateDateOptions(), []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Filter available time slots based on existing appointments
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return timeSlots;
    
    const selectedDateObj = new Date(selectedDate);
    const now = new Date();
    
    return timeSlots.filter(time => {
      const [hours, minutes] = time.split(":").map(Number);
      const slotDateTime = setMinutes(setHours(selectedDateObj, hours), minutes);
      
      // Skip past times for today
      if (isBefore(slotDateTime, now)) return false;
      
      // Check if slot is already taken
      const isBooked = existingAppointments.some(apt => {
        const aptTime = format(new Date(apt.datetime), "HH:mm");
        const aptDate = format(new Date(apt.datetime), "yyyy-MM-dd");
        return aptDate === selectedDate && aptTime === time;
      });
      
      return !isBooked;
    });
  }, [selectedDate, timeSlots, existingAppointments]);

  const resetForm = () => {
    setPatientName("");
    setPatientPhone("");
    setSelectedDate("");
    setSelectedTime("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!patientName.trim()) {
      newErrors.patientName = "Le nom est requis";
    } else if (patientName.trim().length < 2) {
      newErrors.patientName = "Le nom doit avoir au moins 2 caractères";
    }
    
    if (!patientPhone.trim()) {
      newErrors.patientPhone = "Le téléphone est requis";
    } else if (!/^[\d\s+\-()]{8,}$/.test(patientPhone.trim())) {
      newErrors.patientPhone = "Numéro de téléphone invalide";
    }
    
    if (!selectedDate) {
      newErrors.selectedDate = "La date est requise";
    }
    
    if (!selectedTime) {
      newErrors.selectedTime = "L'heure est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const datetime = setMinutes(setHours(new Date(selectedDate), hours), minutes);
      
      await onSubmit({
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        datetime,
      });
      
      handleClose();
    } catch (error) {
      // Error handling done in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            Nouveau rendez-vous
          </DialogTitle>
          <DialogDescription>
            Ajouter rapidement un rendez-vous confirmé
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Patient Name */}
          <div className="space-y-2">
            <Label htmlFor="patientName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Nom du patient
            </Label>
            <Input
              id="patientName"
              placeholder="Ex: Sami Ben Amor"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                if (errors.patientName) setErrors(prev => ({ ...prev, patientName: "" }));
              }}
              className={cn(errors.patientName && "border-destructive")}
            />
            {errors.patientName && (
              <p className="text-xs text-destructive">{errors.patientName}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="patientPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Téléphone
            </Label>
            <Input
              id="patientPhone"
              type="tel"
              placeholder="+216 20 123 456"
              value={patientPhone}
              onChange={(e) => {
                setPatientPhone(e.target.value);
                if (errors.patientPhone) setErrors(prev => ({ ...prev, patientPhone: "" }));
              }}
              className={cn(errors.patientPhone && "border-destructive")}
            />
            {errors.patientPhone && (
              <p className="text-xs text-destructive">{errors.patientPhone}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date
            </Label>
            <Select 
              value={selectedDate} 
              onValueChange={(v) => {
                setSelectedDate(v);
                setSelectedTime(""); // Reset time when date changes
                if (errors.selectedDate) setErrors(prev => ({ ...prev, selectedDate: "" }));
              }}
            >
              <SelectTrigger className={cn(errors.selectedDate && "border-destructive")}>
                <SelectValue placeholder="Choisir une date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((date) => (
                  <SelectItem key={date.toISOString()} value={format(date, "yyyy-MM-dd")}>
                    {format(date, "EEEE d MMMM", { locale: fr })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedDate && (
              <p className="text-xs text-destructive">{errors.selectedDate}</p>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Heure
            </Label>
            <Select 
              value={selectedTime} 
              onValueChange={(v) => {
                setSelectedTime(v);
                if (errors.selectedTime) setErrors(prev => ({ ...prev, selectedTime: "" }));
              }}
              disabled={!selectedDate}
            >
              <SelectTrigger className={cn(errors.selectedTime && "border-destructive")}>
                <SelectValue placeholder={selectedDate ? "Choisir une heure" : "Choisir d'abord une date"} />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Aucun créneau disponible
                  </div>
                ) : (
                  availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.selectedTime && (
              <p className="text-xs text-destructive">{errors.selectedTime}</p>
            )}
          </div>

          {/* Status Info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
            <div className="w-2 h-2 rounded-full bg-success" />
            Ce rendez-vous sera créé comme <strong>confirmé</strong>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
