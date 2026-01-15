import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { PatientDetailModal } from "@/components/portal/PatientDetailModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Phone,
  Calendar,
  ChevronRight,
  User,
  Users,
  TrendingUp,
  Search,
  Filter,
  UserPlus
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  lastVisit: Date;
  totalVisits: number;
  status: "active" | "inactive" | "new";
  notes?: string;
  avatarUrl?: string; // Mock avatar
}

const mockPatients: Patient[] = [
  {
    id: "1",
    fullName: "Sami Ben Amor",
    phone: "+216 98 123 456",
    email: "sami@email.com",
    lastVisit: new Date(2024, 0, 15),
    totalVisits: 5,
    status: "active",
    notes: "Suivi régulier",
  },
  {
    id: "2",
    fullName: "Amira Khelifi",
    phone: "+216 22 456 789",
    lastVisit: new Date(2024, 0, 10),
    totalVisits: 2,
    status: "new",
  },
  {
    id: "3",
    fullName: "Youssef Mejri",
    phone: "+216 55 789 012",
    email: "youssef@email.com",
    lastVisit: new Date(2024, 0, 8),
    totalVisits: 8,
    status: "active",
    notes: "Patient diabétique",
  },
  {
    id: "4",
    fullName: "Fatma Bouazizi",
    phone: "+216 99 234 567",
    lastVisit: new Date(2024, 0, 5),
    totalVisits: 3,
    status: "inactive",
  },
  {
    id: "5",
    fullName: "Karim Trabelsi",
    phone: "+216 50 345 678",
    email: "karim@email.com",
    lastVisit: new Date(2023, 11, 28),
    totalVisits: 12,
    status: "active",
    notes: "Suivi cardiologique",
  },
  {
    id: "6",
    fullName: "Leila Gharbi",
    phone: "+216 92 567 890",
    lastVisit: new Date(2023, 11, 20),
    totalVisits: 1,
    status: "new",
  },
];

export default function PortalPatients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Derived Stats
  const totalPatients = patients.length;
  const newPatientsThisMonth = patients.filter(p => p.status === "new").length;
  const activePatients = patients.filter(p => p.status === "active").length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.replace(/\s/g, "").includes(searchQuery.replace(/\s/g, ""))
  );

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients(patients.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
  };

  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'active': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Actif</Badge>;
      case 'new': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nouveau</Badge>;
      case 'inactive': return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Inactif</Badge>;
    }
  };

  return (
    <PortalLayout userName="Dr. Ahmed Benali" onLogout={handleLogout}>
      <div className="space-y-8 animate-fade-in">
        {/* Top Bar with Enhanced Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Patients</h1>
            <p className="text-muted-foreground mt-1">Gérez vos dossiers patients et historiques</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau Patient
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="premium-card bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">{totalPatients}</h3>
                  <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-br from-white to-emerald-50/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nouveaux (Ce mois)</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">{newPatientsThisMonth}</h3>
                  <span className="text-xs font-medium text-muted-foreground">vs 4 le mois dernier</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-br from-white to-amber-50/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consultations cette semaine</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">24</h3>
                  <span className="text-xs font-medium text-green-600 flex items-center">
                    +3 vs sem. dernière
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient (nom, téléphone)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-muted/20 border-border/50 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto border-dashed">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Patients Table */}
        <Card className="premium-card overflow-hidden border-0 shadow-lg shadow-gray-100/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="py-4 pl-6 font-semibold">Patient</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Contact</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Dernière visite</TableHead>
                  <TableHead className="hidden lg:table-cell font-semibold">Visites</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer hover:bg-muted/20 transition-all border-b border-border/40 last:border-0 group"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-bold">
                            {patient.fullName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {patient.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">ID: #{patient.id.padStart(4, '0')}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(patient.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-0.5 text-sm">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {patient.phone}
                        </span>
                        {patient.email && (
                          <span className="text-xs text-muted-foreground">{patient.email}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(patient.lastVisit, "d MMM yyyy", { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${Math.min(patient.totalVisits * 10, 100)}%` }} />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{patient.totalVisits}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPatients.length === 0 && (
              <div className="text-center py-24 bg-muted/5">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun patient trouvé</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Nous n'avons trouvé aucun patient correspondant à votre recherche. Essayez d'ajouter un nouveau patient.
                </p>
                <Button className="mt-4" variant="outline" onClick={() => setSearchQuery("")}>
                  Effacer la recherche
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Patient Detail Modal - Kept as is */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPatient(null);
        }}
        onSave={handleSavePatient}
      />
    </PortalLayout>
  );
}
