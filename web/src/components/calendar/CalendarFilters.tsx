import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "no_show" | "attended";

interface CalendarFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AppointmentStatus | "all";
  onStatusChange: (status: AppointmentStatus | "all") => void;
  doctorFilter: string;
  onDoctorChange: (doctorId: string) => void;
  doctors?: { id: string; name: string }[];
  showDoctorFilter?: boolean;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const statusOptions: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmé" },
  { value: "attended", label: "Effectué" },
  { value: "no_show", label: "Absent" },
  { value: "cancelled", label: "Annulé" },
];

export function CalendarFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  doctorFilter,
  onDoctorChange,
  doctors = [],
  showDoctorFilter = false,
  onClearFilters,
  hasActiveFilters,
}: CalendarFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          Filtres
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher patient..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Statut
        </label>
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as AppointmentStatus | "all")}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor Filter */}
      {showDoctorFilter && doctors.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Médecin
          </label>
          <Select value={doctorFilter} onValueChange={onDoctorChange}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les médecins</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Filtres actifs:</p>
          <div className="flex flex-wrap gap-1.5">
            {searchQuery && (
              <Badge variant="secondary" className="text-xs gap-1">
                Recherche: "{searchQuery}"
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onSearchChange("")}
                />
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="text-xs gap-1">
                {statusOptions.find(s => s.value === statusFilter)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onStatusChange("all")}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Légende
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-muted-foreground">En attente</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-muted-foreground">Confirmé</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-info" />
            <span className="text-muted-foreground">Effectué</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Annulé</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Absent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
