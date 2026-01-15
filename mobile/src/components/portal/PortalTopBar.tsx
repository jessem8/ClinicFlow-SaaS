import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortalTopBarProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPatientSearch?: (query: string) => void;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

export function PortalTopBar({
  title,
  subtitle,
  icon,
  onPatientSearch,
  showSearch = true,
  actions,
}: PortalTopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onPatientSearch?.(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onPatientSearch?.("");
    setIsSearchOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Title & Date */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground capitalize">{subtitle || today}</p>
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          {showSearch && (
            <>
              {/* Desktop Search */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 w-64 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={handleClearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Mobile Search Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden h-9 w-9"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {actions}
        </div>
      </div>

      {/* Mobile Search Expanded */}
      {showSearch && isSearchOpen && (
        <div className="sm:hidden relative animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou téléphone..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
