import { Link, useLocation } from "react-router-dom";
import { Calendar, LayoutDashboard, Users, Clock, Star, LogOut, Menu, X, Building2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ClinicAssistant } from "@/components/assistant/ClinicAssistant";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const doctorNavItems: NavItem[] = [
  { label: "Tableau de bord", href: "/portal", icon: LayoutDashboard },
  { label: "Agenda", href: "/portal/calendar", icon: Calendar },
  { label: "Patients", href: "/portal/patients", icon: Users },
  { label: "Horaires", href: "/portal/availability", icon: Clock },
  { label: "Avis", href: "/portal/reviews", icon: Star },
];

interface PortalLayoutProps {
  children: React.ReactNode;
  type?: "doctor" | "admin";
  userName?: string;
  onLogout?: () => void;
}

export function PortalLayout({
  children,
  type = "doctor",
  userName = "Dr. Ahmed",
  onLogout
}: PortalLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = doctorNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dark Top Header - Safe Area Aware */}
      <header className="sticky top-0 z-40 bg-gray-950 border-b border-gray-800 pt-[env(safe-area-inset-top)] transition-all duration-200">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger (Sheet) */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white hover:bg-white/10 -ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0 border-r-gray-800 bg-gray-950 text-white pt-[env(safe-area-inset-top)]">
                <div className="flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <Stethoscope className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-heading text-xl font-bold text-white">
                        ClinicFlow
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 w-fit mt-4">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-300">
                        Clinique El Manar
                      </span>
                    </div>
                  </div>

                  {/* Sidebar Navigation */}
                  <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.href ||
                        (item.href !== "/portal" && location.pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 h-12 text-base font-medium transition-all",
                              isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Sidebar Footer */}
                  <div className="p-4 border-t border-gray-800 bg-gray-900/50 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <div className="flex items-center gap-3 px-2 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-300">DA</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">{userName}</p>
                        <p className="text-xs text-gray-500">Médecin Principal</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout?.();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-3">
              <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white block">
                ClinicFlow
              </span>
            </Link>

            {/* Clinic Badge (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                Clinique El Manar
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/portal" && location.pathname.startsWith(item.href));
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 text-gray-400 hover:text-white hover:bg-white/10 transition-all",
                      isActive && "bg-primary text-white hover:bg-primary/90 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm font-medium text-gray-300">
              {userName}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title="Déconnexion"
              className="hidden md:flex text-gray-400 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-1 py-6 md:py-8 animate-fade-in px-4 md:px-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
        {children}
      </main>

      {/* AI Assistant */}
      <ClinicAssistant />
    </div>
  );
}
