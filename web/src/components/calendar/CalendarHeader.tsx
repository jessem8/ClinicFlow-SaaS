import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

type ViewType = "day" | "week";

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  dateLabel: string;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  dateLabel,
}: CalendarHeaderProps) {
  const isToday = isSameDay(currentDate, new Date());

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <CalendarIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Calendrier</h1>
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Today Button */}
        <Button 
          variant={isToday ? "secondary" : "outline"} 
          size="sm"
          onClick={onToday}
          className="hidden sm:flex"
        >
          Aujourd'hui
        </Button>

        {/* Navigation */}
        <div className="flex items-center rounded-lg border border-border bg-card">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-r-none border-r border-border"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-l-none"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <Button
            variant={view === "day" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("day")}
            className={cn(
              "h-8 px-3 rounded-md text-xs font-medium",
              view === "day" && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Jour
          </Button>
          <Button
            variant={view === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("week")}
            className={cn(
              "h-8 px-3 rounded-md text-xs font-medium",
              view === "week" && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Semaine
          </Button>
        </div>
      </div>
    </div>
  );
}
