import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface SlotPickerProps {
  availableSlots: Record<string, TimeSlot[]>;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectSlot: (date: Date, time: string) => void;
  consultationDuration: number;
}

export function SlotPicker({
  availableSlots,
  selectedDate,
  selectedTime,
  onSelectSlot,
  consultationDuration,
}: SlotPickerProps) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPrevWeek = () => setWeekStart(addDays(weekStart, -7));
  const goToNextWeek = () => setWeekStart(addDays(weekStart, 7));

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon-sm" 
          onClick={goToPrevWeek}
          disabled={isPastDate(addDays(weekStart, 6))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-foreground">
          {format(weekStart, "d MMM", { locale: fr })} - {format(addDays(weekStart, 6), "d MMM yyyy", { locale: fr })}
        </span>
        <Button variant="ghost" size="icon-sm" onClick={goToNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Selector */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const dateKey = getDateKey(day);
          const daySlots = availableSlots[dateKey] || [];
          const hasAvailableSlots = daySlots.some((s) => s.available);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = isPastDate(day);

          return (
            <button
              key={dateKey}
              onClick={() => !isPast && hasAvailableSlots && onSelectSlot(day, "")}
              disabled={isPast || !hasAvailableSlots}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all",
                "border border-transparent",
                isPast || !hasAvailableSlots
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-accent cursor-pointer",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                {format(day, "EEE", { locale: fr })}
              </span>
              <span className="text-lg font-semibold">
                {format(day, "d")}
              </span>
              {hasAvailableSlots && !isPast && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1",
                  isSelected ? "bg-primary-foreground" : "bg-primary"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-4 animate-fade-in">
          <p className="text-sm font-medium text-foreground mb-3">
            Créneaux disponibles - {format(selectedDate, "EEEE d MMMM", { locale: fr })}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(availableSlots[getDateKey(selectedDate)] || [])
              .filter((slot) => slot.available)
              .map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => onSelectSlot(selectedDate, slot.time)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                      isSelected
                        ? "slot-selected"
                        : "slot-available"
                    )}
                  >
                    {slot.time}
                  </button>
                );
              })}
          </div>
          {selectedTime && (
            <p className="mt-3 text-sm text-muted-foreground">
              Durée de la consultation : {consultationDuration} minutes
            </p>
          )}
        </div>
      )}
    </div>
  );
}
