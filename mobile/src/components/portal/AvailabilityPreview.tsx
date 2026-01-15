import { format, addDays, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  slotDuration: number;
}

interface AvailabilityPreviewProps {
  schedule: DaySchedule[];
}

export function AvailabilityPreview({ schedule }: AvailabilityPreviewProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getScheduleForDay = (date: Date) => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday from 0 to 7
    return schedule.find(s => s.dayOfWeek === dayOfWeek);
  };

  const generateSlots = (daySchedule: DaySchedule) => {
    if (!daySchedule.isActive) return [];

    const slots: string[] = [];
    const [startHour, startMin] = daySchedule.startTime.split(":").map(Number);
    const [endHour, endMin] = daySchedule.endTime.split(":").map(Number);
    const [breakStartHour, breakStartMin] = daySchedule.breakStart.split(":").map(Number);
    const [breakEndHour, breakEndMin] = daySchedule.breakEnd.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const breakStartMinutes = breakStartHour * 60 + breakStartMin;
    const breakEndMinutes = breakEndHour * 60 + breakEndMin;

    while (currentMinutes < endMinutes) {
      // Skip break time
      if (currentMinutes >= breakStartMinutes && currentMinutes < breakEndMinutes) {
        currentMinutes = breakEndMinutes;
        continue;
      }

      const hours = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;
      slots.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
      currentMinutes += daySchedule.slotDuration;
    }

    return slots;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Aperçu des 7 prochains jours</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {next7Days.map((date) => {
          const daySchedule = getScheduleForDay(date);
          const isActive = daySchedule?.isActive ?? false;
          const slots = daySchedule ? generateSlots(daySchedule) : [];
          const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "rounded-lg border p-2 text-center transition-colors",
                isActive ? "bg-card border-border" : "bg-muted/30 border-muted",
                isToday && "ring-2 ring-primary/50"
              )}
            >
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {format(date, "EEE", { locale: fr })}
              </p>
              <p className={cn(
                "text-lg font-semibold mt-1",
                isToday && "text-primary"
              )}>
                {format(date, "d")}
              </p>
              
              <div className="mt-2">
                {isActive ? (
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-xs text-muted-foreground">
                      {slots.length} créneaux
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Fermé</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slot legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Jour ouvert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span>Fermé</span>
        </div>
      </div>
    </div>
  );
}
