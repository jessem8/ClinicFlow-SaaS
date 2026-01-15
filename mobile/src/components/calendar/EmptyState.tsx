import { Calendar, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: "no-appointments" | "no-results";
  className?: string;
}

export function EmptyState({ type, className }: EmptyStateProps) {
  if (type === "no-appointments") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          Aucun rendez-vous
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Vous n'avez pas de rendez-vous programmé pour cette période. 
          Les nouveaux rendez-vous apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">
        Aucun résultat
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Aucun rendez-vous ne correspond à vos critères de recherche. 
        Essayez de modifier vos filtres.
      </p>
    </div>
  );
}
