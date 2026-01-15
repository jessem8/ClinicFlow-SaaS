import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { AppointmentCard } from "@/components/booking/AppointmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  Bell,
  Plus,
  UserX,
  Wallet,
  LayoutDashboard,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

// Mock data for demo
const mockAppointments = [
  {
    id: "1",
    patientName: "Sami Ben Amor",
    patientPhone: "+216 98 123 456",
    datetime: new Date(new Date().setHours(9, 0, 0, 0)),
    duration: 30,
    status: "confirmed" as const,
    notes: "Consultation de suivi",
  },
  {
    id: "2",
    patientName: "Amira Khelifi",
    patientPhone: "+216 22 456 789",
    datetime: new Date(new Date().setHours(10, 0, 0, 0)),
    duration: 30,
    status: "pending" as const,
  },
  {
    id: "3",
    patientName: "Youssef Mejri",
    patientPhone: "+216 55 789 012",
    datetime: new Date(new Date().setHours(11, 0, 0, 0)),
    duration: 30,
    status: "confirmed" as const,
    notes: "Première consultation",
  },
  {
    id: "4",
    patientName: "Fatma Bouazizi",
    patientPhone: "+216 99 234 567",
    datetime: new Date(new Date().setHours(14, 30, 0, 0)),
    duration: 30,
    status: "pending" as const,
  },
];

const mockStats = {
  todayAppointments: 8,
  pendingConfirmations: 3,
  thisWeekPatients: 24,
  attendanceRate: 92,
  noShowsThisMonth: 4,
  revenueSaved: 480,
  revenueThisMonth: 2400,
  revenueTrend: 12,
};

// Get time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

// Animated counter component
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

// Progress ring component
function ProgressRing({ value, size = 60, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        className="fill-none stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="fill-none stroke-primary transition-all duration-1000"
        style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
      />
    </svg>
  );
}

export default function PortalDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [userName, setUserName] = useState("Dr. Ahmed Benali");
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    // Check auth state
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const todayAppointments = appointments.filter(apt => isToday(apt.datetime));
  const pendingAppointments = appointments.filter(apt => apt.status === "pending");

  return (
    <PortalLayout userName={userName} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Top Bar with Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              {getGreeting()}, Dr. Ahmed 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Voici un aperçu de votre journée — {format(new Date(), "EEEE d MMMM", { locale: fr })}
            </p>
          </div>
          <Link to="/portal/calendar">
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-4 w-4" />
              Nouveau RDV
            </Button>
          </Link>
        </div>

        {/* Pending Alert - Enhanced */}
        {pendingAppointments.length > 0 && (
          <div className="animate-slide-up flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 animate-pulse-soft">
              <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {pendingAppointments.length} rendez-vous en attente de confirmation
              </p>
              <p className="text-sm text-muted-foreground">
                Confirmez pour envoyer les rappels automatiques
              </p>
            </div>
            <Link to="/portal/calendar">
              <Button variant="outline" size="sm" className="border-amber-500/30 hover:bg-amber-500/10">
                Confirmer tout
              </Button>
            </Link>
          </div>
        )}

        {/* Bento Grid - Main Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue Card - Featured */}
          <div className="lg:col-span-2 premium-card p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Revenus ce mois
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-foreground mt-2 font-accent">
                    <AnimatedCounter value={mockStats.revenueThisMonth} suffix=" DT" />
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  <ArrowUpRight className="h-4 w-4" />
                  +{mockStats.revenueTrend}%
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Préservés</p>
                  <p className="text-lg font-semibold text-primary mt-1">
                    <AnimatedCounter value={mockStats.revenueSaved} suffix=" DT" />
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Grâce aux rappels</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-muted-foreground">40% moins d'absences</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Appointments Card */}
          <div className="premium-card p-6 group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aujourd'hui</p>
                <p className="text-4xl font-bold text-foreground mt-2">
                  <AnimatedCounter value={mockStats.todayAppointments} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">rendez-vous</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
            </div>
          </div>

          {/* Attendance Rate Card with Progress Ring */}
          <div className="premium-card p-6 group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux de présence</p>
                <p className="text-4xl font-bold text-foreground mt-2">
                  <AnimatedCounter value={mockStats.attendanceRate} suffix="%" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">ce mois</p>
              </div>
              <div className="relative">
                <ProgressRing value={mockStats.attendanceRate} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Pending Confirmations */}
          <div className="premium-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                <AnimatedCounter value={mockStats.pendingConfirmations} />
              </p>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              Action requise
            </Badge>
          </div>

          {/* Weekly Patients */}
          <div className="premium-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Cette semaine</p>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={mockStats.thisWeekPatients} />
              </p>
            </div>
            <span className="text-sm text-muted-foreground">patients</span>
          </div>

          {/* No-shows */}
          <div className="premium-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <UserX className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Absences</p>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={mockStats.noShowsThisMonth} />
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <ArrowDownRight className="h-4 w-4" />
              -2
            </div>
          </div>
        </div>

        {/* Today's Appointments & Pending */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="premium-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
              <CardTitle className="text-lg font-semibold">Rendez-vous du jour</CardTitle>
              <Link to="/portal/calendar">
                <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                  Voir tout
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.slice(0, 4).map((apt, i) => (
                  <div key={apt.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <AppointmentCard
                      {...apt}
                      compact
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Aucun rendez-vous aujourd'hui
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Profitez de votre journée ! ☀️
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="premium-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                À confirmer
                {pendingAppointments.length > 0 && (
                  <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 animate-pulse-soft">
                    {pendingAppointments.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((apt, i) => (
                  <div key={apt.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <AppointmentCard
                      {...apt}
                      compact
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-emerald-500" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Tous les rendez-vous sont confirmés
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Excellent travail ! 🎉
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
