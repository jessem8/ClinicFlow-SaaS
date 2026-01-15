import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid, type CalendarAppointment } from "@/components/calendar/CalendarGrid";
import { CalendarFilters } from "@/components/calendar/CalendarFilters";
import { AppointmentModal } from "@/components/calendar/AppointmentModal";
import { QuickAddModal } from "@/components/calendar/QuickAddModal";
import { EmptyState } from "@/components/calendar/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Plus, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { 
  format, 
  startOfWeek, 
  addDays, 
  addWeeks, 
  subWeeks,
  subDays,
  isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "no_show" | "attended";
type ViewType = "day" | "week";

// Generate realistic mock data
const generateMockCalendarData = (): CalendarAppointment[] => {
  const appointments: CalendarAppointment[] = [];
  const today = new Date();
  
  const names = [
    "Sami Ben Amor", "Amira Khelifi", "Youssef Mejri", 
    "Fatma Bouazizi", "Karim Trabelsi", "Leila Gharbi",
    "Mohamed Sahli", "Nadia Hamdi", "Omar Chtioui", "Salma Rezgui"
  ];
  
  const phones = [
    "+216 20 123 456", "+216 21 234 567", "+216 22 345 678",
    "+216 23 456 789", "+216 24 567 890", "+216 25 678 901"
  ];
  
  const statuses: AppointmentStatus[] = ["pending", "confirmed", "attended"];
  
  for (let i = -7; i < 14; i++) {
    const date = addDays(today, i);
    if (date.getDay() === 0) continue; // Skip Sundays
    
    // Random number of appointments (3-7)
    const numAppointments = Math.floor(Math.random() * 5) + 3;
    const usedHours = new Set<number>();
    
    for (let j = 0; j < numAppointments; j++) {
      let hour = Math.floor(Math.random() * 9) + 8; // 8-16
      while (usedHours.has(hour) && usedHours.size < 9) {
        hour = Math.floor(Math.random() * 9) + 8;
      }
      usedHours.add(hour);
      
      const minutes = Math.random() > 0.5 ? 0 : 30;
      const datetime = new Date(date);
      datetime.setHours(hour, minutes, 0, 0);
      
      // Past appointments are mostly attended
      const status = i < 0 
        ? (Math.random() > 0.1 ? "attended" : "no_show")
        : statuses[Math.floor(Math.random() * statuses.length)];
      
      appointments.push({
        id: `apt-${format(date, "yyyy-MM-dd")}-${j}`,
        patientName: names[Math.floor(Math.random() * names.length)],
        patientPhone: phones[Math.floor(Math.random() * phones.length)],
        datetime,
        duration: 30,
        status,
        notes: Math.random() > 0.7 ? "Consultation de suivi" : undefined,
      });
    }
  }
  
  return appointments.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
};

export default function PortalCalendar() {
  const navigate = useNavigate();
  
  // Auth state
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Calendar state
  const [view, setView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  
  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setIsAuthenticated(true);
      // Load mock data (in production, fetch from Supabase)
      setAppointments(generateMockCalendarData());
      setIsLoading(false);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (view === "week") {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subDays(prev, 1));
    }
  }, [view]);

  const handleNext = useCallback(() => {
    if (view === "week") {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addDays(prev, 1));
    }
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Calculate week days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 11 }, (_, i) => i + 7); // 7:00 - 17:00

  // Format date label
  const dateLabel = useMemo(() => {
    if (view === "day") {
      return format(currentDate, "EEEE d MMMM yyyy", { locale: fr });
    }
    return `${format(weekStart, "d", { locale: fr })} - ${format(addDays(weekStart, 5), "d MMMM yyyy", { locale: fr })}`;
  }, [view, currentDate, weekStart]);

  // Combine search queries
  const combinedSearch = globalSearch || searchQuery;

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Date filter based on view
      const aptDate = new Date(apt.datetime);
      if (view === "day") {
        if (!isSameDay(aptDate, currentDate)) return false;
      } else {
        const isInWeek = weekDays.some(d => isSameDay(aptDate, d));
        if (!isInWeek) return false;
      }
      
      // Status filter
      if (statusFilter !== "all" && apt.status !== statusFilter) return false;
      
      // Search filter
      if (combinedSearch) {
        const query = combinedSearch.toLowerCase();
        const matchesName = apt.patientName.toLowerCase().includes(query);
        const matchesPhone = apt.patientPhone.replace(/\s/g, "").includes(query.replace(/\s/g, ""));
        if (!matchesName && !matchesPhone) return false;
      }
      
      return true;
    });
  }, [appointments, view, currentDate, weekDays, statusFilter, combinedSearch]);

  const hasActiveFilters = combinedSearch !== "" || statusFilter !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setGlobalSearch("");
    setStatusFilter("all");
    setDoctorFilter("all");
  };

  // Appointment handlers
  const handleAppointmentClick = (apt: CalendarAppointment) => {
    setSelectedAppointment(apt);
    setModalOpen(true);
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    // Optimistic update
    const previousAppointments = [...appointments];
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status } : apt)
    );
    
    // Update selected appointment if it's the one being changed
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status } : null);
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const statusLabels: Record<AppointmentStatus, string> = {
        pending: "en attente",
        confirmed: "confirmé",
        cancelled: "annulé",
        no_show: "marqué absent",
        attended: "marqué effectué",
      };
      
      toast.success(`Rendez-vous ${statusLabels[status]}`);
    } catch (error) {
      // Rollback on error
      setAppointments(previousAppointments);
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(previousAppointments.find(a => a.id === id) || null);
      }
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, notes } : apt)
      );
      
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(prev => prev ? { ...prev, notes } : null);
      }
      
      toast.success("Notes enregistrées");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
      throw error;
    }
  };

  // Quick add handler
  const handleQuickAdd = async (data: {
    patientName: string;
    patientPhone: string;
    datetime: Date;
  }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newAppointment: CalendarAppointment = {
        id: `apt-quick-${Date.now()}`,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        datetime: data.datetime,
        duration: 30,
        status: "confirmed",
      };
      
      setAppointments(prev => [...prev, newAppointment].sort(
        (a, b) => a.datetime.getTime() - b.datetime.getTime()
      ));
      
      toast.success("Rendez-vous créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création");
      throw error;
    }
  };

  // Filter Panel Component
  const FilterPanel = (
    <CalendarFilters
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      statusFilter={statusFilter}
      onStatusChange={setStatusFilter}
      doctorFilter={doctorFilter}
      onDoctorChange={setDoctorFilter}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PortalLayout userName="Dr. Ahmed Benali" onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Top Bar */}
        <PortalTopBar
          title="Agenda"
          subtitle={dateLabel}
          icon={<CalendarIcon className="h-5 w-5" />}
          onPatientSearch={setGlobalSearch}
          actions={
            <Button onClick={() => setQuickAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveau rendez-vous</span>
            </Button>
          }
        />

        {/* Calendar Header with Navigation */}
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
          dateLabel={dateLabel}
        />

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Filters - Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24 p-4">
              {FilterPanel}
            </Card>
          </aside>

          {/* Calendar Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex items-center gap-2">
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtres
                    {hasActiveFilters && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        {(combinedSearch ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    {FilterPanel}
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="sm" onClick={handleToday} className="lg:hidden">
                Aujourd'hui
              </Button>
            </div>

            {/* Calendar Card */}
            <Card className="overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAppointments.length === 0 ? (
                <EmptyState type={hasActiveFilters ? "no-results" : "no-appointments"} />
              ) : (
                <CalendarGrid
                  view={view}
                  currentDate={currentDate}
                  weekDays={weekDays}
                  hours={hours}
                  appointments={filteredAppointments}
                  onAppointmentClick={handleAppointmentClick}
                  isLoading={isLoading}
                  workingHours={{ start: 8, end: 18 }}
                />
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAppointment(null);
        }}
        onStatusChange={handleStatusChange}
        onNotesChange={handleNotesChange}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAdd}
        existingAppointments={appointments}
      />

      {/* Floating Action Button - Mobile Only */}
      <Button
        onClick={() => setQuickAddOpen(true)}
        className={cn(
          "lg:hidden fixed bottom-6 right-6 z-50",
          "h-14 w-14 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90",
          "flex items-center justify-center",
          "transition-transform hover:scale-105 active:scale-95"
        )}
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Ajouter un rendez-vous</span>
      </Button>
    </PortalLayout>
  );
}
