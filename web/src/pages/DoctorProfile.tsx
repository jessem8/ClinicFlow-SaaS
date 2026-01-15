import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Info,
  Phone,
  Globe,
  CreditCard,
  User,
  Loader2
} from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

// Mock data
const doctorData = {
  id: "1",
  slug: "ahmed-benali",
  title: "Dr.",
  fullName: "Ahmed Benali",
  specialty: "Médecine générale",
  bio: "Spécialiste en médecine familiale avec plus de 15 ans d'expérience. Je prends en charge les patients de tous âges pour des consultations de médecine générale, de suivi de maladies chroniques et de prévention.",
  clinicName: "Clinique El Manar",
  address: "Rue du Lac Léman, Les Berges du Lac, Tunis",
  phone: "+216 71 123 456",
  consultationPrice: "50 DT",
  consultationDuration: 30,
  rating: 4.9,
  reviewCount: 127,
  languages: ["Français", "Arabe", "Anglais"],
  insurance: ["CNAM", "GAT", "Comar"],
  availability: [
    ...Array.from({ length: 14 }).flatMap((_, dayIdx) => {
      const date = addDays(new Date(), dayIdx);
      if (date.getDay() === 0 || date.getDay() === 6) return [];
      return [
        "09:00", "09:30", "10:00", "10:30",
        "14:00", "14:30", "15:00", "15:30", "16:00"
      ].map(time => ({
        date,
        time,
        available: Math.random() > 0.3
      }));
    })
  ]
};

export default function DoctorProfile() {
  const { slug } = useParams();
  const doctor = doctorData;

  const [selectedSlot, setSelectedSlot] = useState<{ date: Date, time: string } | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isBooking, setIsBooking] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [step, setStep] = useState<"slots" | "form" | "confirm">("slots");

  const handlePrevWeek = () => {
    const newDate = subWeeks(currentWeekStart, 1);
    if (newDate >= startOfWeek(new Date(), { weekStartsOn: 1 })) {
      setCurrentWeekStart(newDate);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const weekDays = Array.from({ length: 6 }).map((_, i) => addDays(currentWeekStart, i));

  const getSlotsForDay = (date: Date) => {
    return doctor.availability.filter(slot => isSameDay(slot.date, date));
  };

  const handleSlotClick = (date: Date, time: string, available: boolean) => {
    if (!available) return;
    setSelectedSlot({ date, time });
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsBooking(false);
    setStep("confirm");
    toast.success("Rendez-vous confirmé !");
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-gray-950 to-gray-950" />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-primary/15 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative z-10 py-12">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour à la recherche
          </Link>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Doctor Avatar & Quick Info */}
            <div className="flex items-center gap-6">
              <Avatar className="w-28 h-28 ring-4 ring-white/10 shadow-2xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${doctor.slug}`} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {doctor.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge className="bg-primary/20 text-primary-400 border-0 mb-2">
                  {doctor.specialty}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {doctor.title} {doctor.fullName}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-gray-400">({doctor.reviewCount} avis)</span>
                  </div>
                  <div className="h-4 w-px bg-gray-700" />
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.clinicName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-100 min-h-screen">
        <div className="container py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Doctor Details */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-900">Informations</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doctor.clinicName}</p>
                          <p className="text-sm text-gray-500">{doctor.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-gray-600">{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-gray-600">{doctor.consultationDuration} min • {doctor.consultationPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">À propos</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {doctor.bio}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Langues</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map(lang => (
                        <Badge key={lang} variant="secondary" className="font-normal">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">Assurances acceptées</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.insurance.map(ins => (
                        <Badge key={ins} variant="outline" className="font-normal">
                          {ins}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/10 rounded-2xl">
                <CardContent className="p-5 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Réservation sécurisée</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Gratuit • Confirmation instantanée • Rappel SMS
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Booking */}
            <div className="lg:col-span-8">
              {step === "slots" && (
                <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Choisir un créneau
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Créneaux mis à jour en temps réel
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={handlePrevWeek}
                        disabled={currentWeekStart <= startOfWeek(new Date(), { weekStartsOn: 1 })}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="font-medium text-gray-700 min-w-[140px] text-center">
                        {format(currentWeekStart, "MMMM yyyy", { locale: fr })}
                      </span>
                      <Button variant="outline" size="icon" className="rounded-xl" onClick={handleNextWeek}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {weekDays.map((day) => {
                        const slots = getSlotsForDay(day);
                        const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                        const isToday = isSameDay(day, new Date());

                        return (
                          <div key={day.toString()} className="space-y-3">
                            <div className={`text-center p-3 rounded-xl transition-colors ${isToday
                                ? 'bg-primary text-white font-bold'
                                : 'bg-gray-100 text-gray-600'
                              }`}>
                              <div className="text-xs uppercase font-medium">{format(day, "EEE", { locale: fr })}</div>
                              <div className="text-xl">{format(day, "d")}</div>
                            </div>

                            <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
                              {!isPast && slots.length > 0 ? (
                                slots.map((slot, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSlotClick(day, slot.time, slot.available)}
                                    disabled={!slot.available}
                                    className={`w-full py-2.5 text-sm rounded-lg border transition-all duration-200
                                      ${slot.available
                                        ? 'bg-white hover:border-primary hover:text-primary hover:shadow-md text-gray-700 border-gray-200'
                                        : 'bg-gray-50 text-gray-300 border-transparent cursor-not-allowed'
                                      }
                                    `}
                                  >
                                    {slot.available ? slot.time : <span className="line-through">{slot.time}</span>}
                                  </button>
                                ))
                              ) : (
                                <div className="text-xs text-center text-gray-400 py-4">
                                  Aucun créneau
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "form" && selectedSlot && (
                <div className="animate-fade-in max-w-xl mx-auto">
                  <Button variant="ghost" className="mb-4" onClick={() => setStep("slots")}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Changer de créneau
                  </Button>

                  <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary-600 p-6 text-white">
                      <h2 className="text-lg font-bold mb-1">Confirmez votre rendez-vous</h2>
                      <div className="flex items-center gap-2 opacity-90">
                        <Calendar className="w-4 h-4" />
                        {format(selectedSlot.date, "EEEE d MMMM", { locale: fr })} à {selectedSlot.time}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <form onSubmit={handleBooking} className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Nom complet</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Votre nom"
                                value={patientName}
                                onChange={e => setPatientName(e.target.value)}
                                className="h-12 pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                type="tel"
                                placeholder="+216"
                                value={patientPhone}
                                onChange={e => setPatientPhone(e.target.value)}
                                className="h-12 pl-10"
                                required
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              Un SMS de confirmation sera envoyé.
                            </p>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25"
                          disabled={isBooking}
                        >
                          {isBooking && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                          {isBooking ? "Confirmation..." : "Confirmer le rendez-vous"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {step === "confirm" && selectedSlot && (
                <div className="text-center py-16 animate-scale-in max-w-lg mx-auto">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Rendez-vous confirmé !</h2>
                  <p className="text-gray-600 text-lg mb-2">
                    Votre rendez-vous avec {doctor.title} {doctor.fullName}
                  </p>
                  <p className="text-xl font-semibold text-primary mb-8">
                    {format(selectedSlot.date, "EEEE d MMMM", { locale: fr })} à {selectedSlot.time}
                  </p>

                  <Card className="bg-amber-50 border-amber-200 text-left mb-8">
                    <CardContent className="p-5">
                      <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4" />
                        Informations importantes
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-2 list-disc pl-5">
                        <li>Un SMS de rappel vous sera envoyé 24h avant.</li>
                        <li>Veuillez arriver 10 minutes à l'avance.</li>
                        <li>En cas d'empêchement, annulez au moins 2h avant.</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center gap-4">
                    <Link to="/">
                      <Button variant="outline" size="lg">Retour à l'accueil</Button>
                    </Link>
                    <Button size="lg">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ajouter au calendrier
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
