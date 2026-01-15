import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface DoctorCardProps {
  id: string;
  slug: string;
  title: string;
  fullName: string;
  specialty: string;
  clinicName: string;
  clinicCity: string;
  photoUrl?: string;
  rating?: number;
  consultationDuration: number;
}

export function DoctorCard({
  slug,
  title,
  fullName,
  specialty,
  clinicName,
  clinicCity,
  photoUrl,
  rating = 4.8,
  consultationDuration,
}: DoctorCardProps) {
  return (
    <Link to={`/d/${slug}`}>
      <Card variant="interactive" className="overflow-hidden h-full">
        <CardContent className="p-0">
          <div className="flex gap-4 p-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 rounded-xl bg-gradient-hero flex items-center justify-center overflow-hidden">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt={`${title} ${fullName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary-foreground">
                    {fullName.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {title} {fullName}
              </h3>
              <Badge variant="specialty" className="mt-1">
                {specialty}
              </Badge>
              
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{clinicName}, {clinicCity}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{consultationDuration} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
