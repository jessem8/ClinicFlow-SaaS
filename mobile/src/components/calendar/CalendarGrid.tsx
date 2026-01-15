import { format, isSameDay, isToday, getHours, getMinutes, addMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Clock, User, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "no_show" | "attended";

export interface CalendarAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  datetime: Date;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
}

interface CalendarGridProps {
  view: "day" | "week";
  currentDate: Date;
  weekDays: Date[];
  hours: number[];
  appointments: CalendarAppointment[];
  onAppointmentClick: (appointment: CalendarAppointment) => void;
  isLoading?: boolean;
  workingHours?: { start: number; end: number };
}

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-warning/15 border-l-warning text-foreground hover:bg-warning/25",
  confirmed: "bg-success/15 border-l-success text-foreground hover:bg-success/25",
  cancelled: "bg-muted/50 border-l-muted-foreground text-muted-foreground",
  no_show: "bg-destructive/10 border-l-destructive text-foreground hover:bg-destructive/15",
  attended: "bg-info/15 border-l-info text-foreground hover:bg-info/25",
};

const statusDotColors: Record<AppointmentStatus, string> = {
  pending: "bg-warning",
  confirmed: "bg-success",
  cancelled: "bg-muted-foreground",
  no_show: "bg-destructive",
  attended: "bg-info",
};

export function CalendarGrid({
  view,
  currentDate,
  weekDays,
  hours,
  appointments,
  onAppointmentClick,
  isLoading = false,
  workingHours = { start: 8, end: 18 },
}: CalendarGridProps) {
  const now = new Date();
  const currentHour = getHours(now);
  const currentMinute = getMinutes(now);
  const showNowLine = view === "day" ? isToday(currentDate) : weekDays.some(d => isToday(d));

  const getAppointmentsForSlot = (date: Date, hour: number) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.datetime);
      return (
        isSameDay(aptDate, date) &&
        getHours(aptDate) === hour
      );
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.datetime);
      return isSameDay(aptDate, date);
    });
  };

  if (isLoading) {
    return <CalendarSkeleton view={view} hours={hours} weekDays={weekDays} />;
  }

  if (view === "day") {
    const dayAppointments = getAppointmentsForDay(currentDate);
    
    return (
      <div className="relative">
        {/* Now Line */}
        {showNowLine && isToday(currentDate) && (
          <NowIndicator hour={currentHour} minute={currentMinute} hours={hours} />
        )}

        <div className="divide-y divide-border/50">
          {hours.map((hour) => {
            const slotAppointments = getAppointmentsForSlot(currentDate, hour);
            const isWorkingHour = hour >= workingHours.start && hour < workingHours.end;
            const isCurrentHour = isToday(currentDate) && hour === currentHour;

            return (
              <div
                key={hour}
                className={cn(
                  "flex min-h-[80px] transition-colors",
                  !isWorkingHour && "bg-muted/30",
                  isCurrentHour && "bg-primary/5"
                )}
              >
                {/* Time Label */}
                <div className="w-20 flex-shrink-0 py-3 px-3 text-right">
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrentHour ? "text-primary" : "text-muted-foreground"
                  )}>
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                </div>

                {/* Appointments */}
                <div className="flex-1 py-2 px-2 space-y-1.5">
                  {slotAppointments.length === 0 ? (
                    <div className="h-full" />
                  ) : (
                    slotAppointments.map((apt) => (
                      <AppointmentBlock
                        key={apt.id}
                        appointment={apt}
                        onClick={() => onAppointmentClick(apt)}
                        variant="day"
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week View
  return (
    <div className="relative overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day Headers */}
        <div className="grid grid-cols-[72px_repeat(6,1fr)] border-b border-border bg-muted/30 sticky top-0 z-10">
          <div className="p-3 text-center text-xs font-medium text-muted-foreground border-r border-border/50">
            Heure
          </div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "p-3 text-center border-r border-border/50 last:border-r-0",
                isToday(day) && "bg-primary/5"
              )}
            >
              <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                {format(day, "EEE", { locale: fr })}
              </p>
              <p className={cn(
                "mt-1 text-lg font-semibold",
                isToday(day) 
                  ? "text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto" 
                  : "text-foreground"
              )}>
                {format(day, "d")}
              </p>
            </div>
          ))}
        </div>

        {/* Now Line for Week */}
        {showNowLine && (
          <NowIndicatorWeek 
            hour={currentHour} 
            minute={currentMinute} 
            hours={hours} 
            weekDays={weekDays}
          />
        )}

        {/* Time Grid */}
        {hours.map((hour) => {
          const isWorkingHour = hour >= workingHours.start && hour < workingHours.end;
          
          return (
            <div 
              key={hour} 
              className={cn(
                "grid grid-cols-[72px_repeat(6,1fr)] border-b border-border/50",
                !isWorkingHour && "bg-muted/20"
              )}
            >
              <div className="p-2 text-right text-sm font-medium text-muted-foreground border-r border-border/50 flex items-start justify-end pt-3">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {weekDays.map((day) => {
                const slotAppointments = getAppointmentsForSlot(day, hour);
                const isTodaySlot = isToday(day);
                const isCurrentSlot = isTodaySlot && hour === currentHour;

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={cn(
                      "p-1 border-r border-border/50 last:border-r-0 min-h-[70px] transition-colors",
                      isTodaySlot && "bg-primary/5",
                      isCurrentSlot && "bg-primary/10"
                    )}
                  >
                    {slotAppointments.map((apt) => (
                      <AppointmentBlock
                        key={apt.id}
                        appointment={apt}
                        onClick={() => onAppointmentClick(apt)}
                        variant="week"
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AppointmentBlockProps {
  appointment: CalendarAppointment;
  onClick: () => void;
  variant: "day" | "week";
}

function AppointmentBlock({ appointment, onClick, variant }: AppointmentBlockProps) {
  const time = format(new Date(appointment.datetime), "HH:mm");
  const endTime = format(
    addMinutes(new Date(appointment.datetime), appointment.duration),
    "HH:mm"
  );

  if (variant === "week") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full p-1.5 mb-1 rounded-md border-l-3 text-left transition-all cursor-pointer",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50",
          statusStyles[appointment.status]
        )}
      >
        <div className="flex items-center gap-1 mb-0.5">
          <div className={cn("w-1.5 h-1.5 rounded-full", statusDotColors[appointment.status])} />
          <span className="text-[10px] font-semibold">{time}</span>
        </div>
        <p className="text-xs font-medium truncate">{appointment.patientName}</p>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg border-l-4 text-left transition-all cursor-pointer",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50",
        statusStyles[appointment.status]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("w-2 h-2 rounded-full", statusDotColors[appointment.status])} />
            <span className="text-sm font-semibold">
              {time} - {endTime}
            </span>
            <span className="text-xs text-muted-foreground">
              ({appointment.duration} min)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{appointment.patientName}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{appointment.patientPhone}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function NowIndicator({ hour, minute, hours }: { hour: number; minute: number; hours: number[] }) {
  const firstHour = hours[0];
  const topOffset = (hour - firstHour) * 80 + (minute / 60) * 80;

  if (hour < firstHour || hour > hours[hours.length - 1]) return null;

  return (
    <div
      className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
      style={{ top: `${topOffset}px` }}
    >
      <div className="w-20 flex justify-end pr-2">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-sm" />
      </div>
      <div className="flex-1 h-0.5 bg-destructive/70" />
    </div>
  );
}

function NowIndicatorWeek({ 
  hour, 
  minute, 
  hours, 
  weekDays 
}: { 
  hour: number; 
  minute: number; 
  hours: number[]; 
  weekDays: Date[];
}) {
  const firstHour = hours[0];
  const topOffset = 72 + (hour - firstHour) * 70 + (minute / 60) * 70; // 72px for header
  const todayIndex = weekDays.findIndex(d => isToday(d));

  if (hour < firstHour || hour > hours[hours.length - 1] || todayIndex === -1) return null;

  const leftOffset = 72 + (todayIndex * ((100 - 72/8) / 6)); // Approximate column position

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{ 
        top: `${topOffset}px`,
        left: '72px',
        right: 0,
      }}
    >
      <div className="flex items-center">
        <div 
          className="flex items-center"
          style={{ width: `${(todayIndex / 6) * 100}%` }}
        />
        <div className="flex items-center flex-1">
          <div className="w-2 h-2 rounded-full bg-destructive -ml-1" />
          <div className="flex-1 h-0.5 bg-destructive/60" />
        </div>
      </div>
    </div>
  );
}

function CalendarSkeleton({ view, hours, weekDays }: { view: "day" | "week"; hours: number[]; weekDays: Date[] }) {
  if (view === "day") {
    return (
      <div className="space-y-1">
        {hours.slice(0, 6).map((hour) => (
          <div key={hour} className="flex min-h-[80px]">
            <div className="w-20 flex-shrink-0 py-3 px-3 text-right">
              <Skeleton className="h-5 w-12 ml-auto" />
            </div>
            <div className="flex-1 py-2 px-2">
              {Math.random() > 0.5 && <Skeleton className="h-16 w-full rounded-lg" />}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-w-[800px]">
      <div className="grid grid-cols-[72px_repeat(6,1fr)] border-b">
        <Skeleton className="h-16" />
        {weekDays.map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
      {hours.slice(0, 5).map((hour) => (
        <div key={hour} className="grid grid-cols-[72px_repeat(6,1fr)] border-b">
          <Skeleton className="h-16" />
          {weekDays.map((_, i) => (
            <div key={i} className="p-1 min-h-[70px]">
              {Math.random() > 0.6 && <Skeleton className="h-12 w-full rounded" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
