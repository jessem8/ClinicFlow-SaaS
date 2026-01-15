import { useLocation, Link, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  MessageCircle,
  ExternalLink,
  Home
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function BookingConfirmation() {
  const location = useLocation();
  const state = location.state as {
    doctor: {
      title: string;
      fullName: string;
      specialty: string;
      clinicName: string;
      clinicAddress: string;
      clinicCity: string;
      clinicPhone: string;
      googleMapsUrl: string;
    };
    date: Date;
    time: string;
    patientName: string;
    patientPhone: string;
  } | null;

  // Redirect if no booking data
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { doctor, date, time, patientName, patientPhone } = state;
  const appointmentDate = new Date(date);

  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Bonjour, j'ai un rendez-vous avec ${doctor.title} ${doctor.fullName} le ${format(appointmentDate, "d MMMM yyyy", { locale: fr })} à ${time}. Nom: ${patientName}`
  );
  const whatsappUrl = `https://wa.me/216${doctor.clinicPhone?.replace(/\D/g, "").slice(-8)}?text=${whatsappMessage}`;

  return (
    <PublicLayout>
      <div className="container max-w-2xl py-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Rendez-vous confirmé !
          </h1>
          <p className="mt-2 text-muted-foreground">
            Votre rendez-vous a été enregistré avec succès
          </p>
        </div>

        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6 space-y-6">
            {/* Appointment Details */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <Calendar className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {format(appointmentDate, "EEEE d MMMM yyyy", { locale: fr })}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{time}</span>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Médecin</h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">
                    {doctor.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {doctor.title} {doctor.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                </div>
              </div>
            </div>

            {/* Clinic Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Adresse</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{doctor.clinicName}</p>
                    <p className="text-sm text-muted-foreground">{doctor.clinicAddress}</p>
                    <p className="text-sm text-muted-foreground">{doctor.clinicCity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{doctor.clinicPhone}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-3 pt-4 border-t">
              <Button
                variant="whatsapp"
                className="w-full"
                onClick={() => window.open(whatsappUrl, "_blank")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contacter via WhatsApp
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(doctor.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(doctor.clinicName + " " + doctor.clinicCity)}`, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Voir sur Google Maps
              </Button>

              <Link to="/" className="w-full">
                <Button variant="ghost" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Reminder Info */}
        <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "200ms" }}>
          Un rappel SMS vous sera envoyé 24h et 2h avant votre rendez-vous.
        </p>
      </div>
    </PublicLayout>
  );
}
