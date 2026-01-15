import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { AvailabilityPreview } from "@/components/portal/AvailabilityPreview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Plus,
  Save,
  Coffee,
  CalendarOff,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const daysOfWeek = [
  { day: 1, name: "Lundi" },
  { day: 2, name: "Mardi" },
  { day: 3, name: "Mercredi" },
  { day: 4, name: "Jeudi" },
  { day: 5, name: "Vendredi" },
  { day: 6, name: "Samedi" },
  { day: 0, name: "Dimanche" },
];

const defaultSchedule: DaySchedule[] = daysOfWeek.map((d) => ({
  dayOfWeek: d.day,
  dayName: d.name,
  isActive: d.day !== 0 && d.day !== 6, // Weekend off by default
  startTime: "09:00",
  endTime: "17:00",
  breakStart: "12:30",
  breakEnd: "14:00",
  slotDuration: 30,
}));

export default function PortalAvailability() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateDay = (dayOfWeek: number, updates: Partial<DaySchedule>) => {
    setSchedule(schedule.map(day =>
      day.dayOfWeek === dayOfWeek ? { ...day, ...updates } : day
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Vos horaires ont été mis à jour avec succès !");
    setIsSaving(false);
  };

  const activeDaysCount = schedule.filter(d => d.isActive).length;
  const totalHours = activeDaysCount * 8; // Approx

  return (
    <PortalLayout userName="Dr. Ahmed Benali" onLogout={handleLogout}>
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Horaires & Disponibilités</h1>
            <p className="text-muted-foreground mt-1">Configurez votre semaine type et vos absences</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive gap-2">
              <CalendarOff className="h-4 w-4" />
              <span className="hidden sm:inline">Bloquer une période</span>
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              {isSaving ? <span className="animate-spin">⏳</span> : <Save className="h-4 w-4" />}
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Schedule Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="premium-card border-0 shadow-lg shadow-gray-100/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Semaine type
                </CardTitle>
                <CardDescription>
                  Activez les jours où vous consultez et définissez vos heures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {schedule.map((day, index) => (
                  <div key={day.dayOfWeek}>
                    <div className={cn(
                      "p-4 rounded-xl transition-all border border-transparent",
                      day.isActive ? "bg-white hover:border-border" : "bg-muted/30 opacity-70"
                    )}>
                      {/* Day Header Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={day.isActive}
                            onCheckedChange={(checked) => updateDay(day.dayOfWeek, { isActive: checked })}
                            className="data-[state=checked]:bg-primary"
                          />
                          <span className={cn("font-semibold text-lg", day.isActive ? "text-gray-900" : "text-muted-foreground")}>
                            {day.dayName}
                          </span>
                        </div>
                        {day.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Ouvert
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                            Fermé
                          </Badge>
                        )}
                      </div>

                      {/* Time Controls */}
                      {day.isActive && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 animate-slide-up pl-14">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Heures de consultation</Label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Input
                                  type="time"
                                  value={day.startTime}
                                  onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })}
                                  className="h-9 font-mono text-sm border-border/60 focus:border-primary/50"
                                />
                              </div>
                              <span className="text-muted-foreground">-</span>
                              <div className="relative flex-1">
                                <Input
                                  type="time"
                                  value={day.endTime}
                                  onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })}
                                  className="h-9 font-mono text-sm border-border/60 focus:border-primary/50"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                              <Coffee className="h-3 w-3" /> Pause déjeuner
                            </Label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Input
                                  type="time"
                                  value={day.breakStart}
                                  onChange={(e) => updateDay(day.dayOfWeek, { breakStart: e.target.value })}
                                  className="h-9 font-mono text-sm border-border/60 focus:border-primary/50 bg-blue-50/30"
                                />
                              </div>
                              <span className="text-muted-foreground">-</span>
                              <div className="relative flex-1">
                                <Input
                                  type="time"
                                  value={day.breakEnd}
                                  onChange={(e) => updateDay(day.dayOfWeek, { breakEnd: e.target.value })}
                                  className="h-9 font-mono text-sm border-border/60 focus:border-primary/50 bg-blue-50/30"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {index < schedule.length - 1 && <Separator className="my-2 opacity-50" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Settings */}
          <div className="space-y-6">

            {/* Summary Card */}
            <Card className="premium-card bg-primary text-primary-foreground border-none">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Résumé</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-primary-foreground/80">Jours ouvrés</span>
                    <span className="font-mono font-bold text-xl">{activeDaysCount}/7</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-primary-foreground/80">Heures / sem.</span>
                    <span className="font-mono font-bold text-xl">~{totalHours}h</span>
                  </div>
                </div>
                <div className="mt-6 p-3 bg-white/10 rounded-lg text-sm flex gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Votre planning est visible par les patients pour les 3 prochains mois.</p>
                </div>
              </CardContent>
            </Card>

            {/* Default Settings */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-base">Configuration générale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Durée moyenne (minutes)</Label>
                  <Input
                    type="number"
                    defaultValue={30}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Temps par patient par défaut.</p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2 text-destructive">Zone de danger</h4>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10 border-destructive/20">
                    <CalendarOff className="mr-2 h-4 w-4" />
                    Suspendre la prise de RDV
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
