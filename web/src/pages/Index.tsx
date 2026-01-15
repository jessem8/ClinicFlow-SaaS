import { PublicLayout } from "@/components/layout/PublicLayout";
import { DoctorCard } from "@/components/booking/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Calendar,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Users,
  Heart,
  Stethoscope,
  Bell,
  ChevronRight,
  Play
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockDoctors = [
  {
    id: "1",
    slug: "ahmed-benali",
    title: "Dr.",
    fullName: "Ahmed Benali",
    specialty: "Médecine générale",
    clinicName: "Clinique El Manar",
    clinicCity: "Tunis",
    consultationDuration: 30,
    rating: 4.9,
  },
  {
    id: "2",
    slug: "fatma-trabelsi",
    title: "Dr.",
    fullName: "Fatma Trabelsi",
    specialty: "Pédiatrie",
    clinicName: "Clinique El Manar",
    clinicCity: "Tunis",
    consultationDuration: 30,
    rating: 4.8,
  },
  {
    id: "3",
    slug: "mohamed-gharbi",
    title: "Dr.",
    fullName: "Mohamed Gharbi",
    specialty: "Cardiologie",
    clinicName: "Centre Médical Carthage",
    clinicCity: "Carthage",
    consultationDuration: 45,
    rating: 4.7,
  },
  {
    id: "4",
    slug: "salma-jaziri",
    title: "Dr.",
    fullName: "Salma Jaziri",
    specialty: "Dermatologie",
    clinicName: "Centre Médical Carthage",
    clinicCity: "Carthage",
    consultationDuration: 30,
    rating: 4.9,
  },
];

const specialties = [
  { name: "Médecine Générale", icon: Stethoscope, count: 120 },
  { name: "Pédiatrie", icon: Heart, count: 45 },
  { name: "Cardiologie", icon: Heart, count: 32 },
  { name: "Dermatologie", icon: Users, count: 28 },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors] = useState(mockDoctors);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinicCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PublicLayout>
      {/* Hero Section - Dark with Gradient */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-950 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-gray-950 to-gray-950" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                +2,500 médecins nous font confiance
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Prenez
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
                  rendez-vous
                </span>
                en 30 secondes
              </h1>

              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                La plateforme qui connecte les patients aux meilleurs spécialistes en Tunisie.
                Simple, rapide, et disponible 24h/24.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-xl" />
                <div className="relative flex items-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
                  <Search className="h-5 w-5 text-gray-500 ml-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher un médecin, une spécialité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-14 bg-transparent border-0 text-white text-lg placeholder:text-gray-500 focus-visible:ring-0"
                  />
                  <Button size="lg" className="h-12 px-8 rounded-xl font-semibold">
                    Rechercher
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-gray-950 flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="text-white font-semibold">50,000+</div>
                    <div className="text-gray-500">Patients satisfaits</div>
                  </div>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-white font-semibold">4.9</span>
                  <span className="text-gray-500">(2.4k avis)</span>
                </div>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Floating cards */}
                <div className="absolute -left-12 top-1/4 z-20">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/10 text-white p-4 rounded-2xl animate-float">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary-400" />
                      </div>
                      <div>
                        <div className="font-semibold">RDV Confirmé</div>
                        <div className="text-sm text-gray-400">Dr. Benali · 14:30</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="absolute -right-8 bottom-1/3 z-20">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/10 text-white p-4 rounded-2xl animate-float" style={{ animationDelay: "1s" }}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold">Rappel envoyé</div>
                        <div className="text-sm text-gray-400">SMS + Email</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Main illustration placeholder */}
                <div className="relative aspect-square max-w-[500px] mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-[3rem] border border-white/10" />
                  <div className="absolute inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                        <Stethoscope className="w-12 h-12 text-primary-400" />
                      </div>
                      <div className="text-white/60 text-lg">Votre santé, notre priorité</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-sm">Découvrir</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Spécialités</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Trouvez le spécialiste qu'il vous faut
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Des centaines de médecins qualifiés dans toutes les spécialités
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((spec, i) => (
              <Link
                key={i}
                to={`/search?specialty=${spec.name}`}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <spec.icon className="h-7 w-7" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{spec.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{spec.count} médecins disponibles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Comment ça marche</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              3 étapes simples
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Recherchez", desc: "Trouvez un médecin par nom, spécialité ou localisation", icon: Search },
              { step: "02", title: "Réservez", desc: "Choisissez un créneau qui vous convient en temps réel", icon: Calendar },
              { step: "03", title: "Consultez", desc: "Recevez un rappel et présentez-vous au rendez-vous", icon: Clock },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
                )}
                <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 mb-6 group-hover:scale-105 transition-transform">
                  <item.icon className="w-12 h-12 text-primary" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Médecins</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3">
                Nos praticiens recommandés
              </h2>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 group">
              Voir tous les médecins
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <DoctorCard {...doctor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Espace Pro</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Vous êtes médecin ? Rejoignez-nous
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Simplifiez la gestion de votre cabinet et gagnez du temps chaque jour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="h-14 px-10 text-lg font-semibold">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="h-14 px-10 text-lg text-white border border-white/20 hover:bg-white/10 hover:text-white">
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
