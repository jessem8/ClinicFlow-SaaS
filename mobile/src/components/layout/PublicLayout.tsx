import { Link } from "react-router-dom";
import { Phone, MapPin, Mail } from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function PublicLayout({ children, showNav = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {showNav && (
        <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">C</span>
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                ClinicFlow
              </span>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link 
                to="/auth" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Espace médecin
              </Link>
            </nav>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-secondary/30">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">C</span>
                </div>
                <span className="font-heading text-lg font-bold">ClinicFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simplifiez la gestion de vos rendez-vous médicaux en Tunisie.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+216 XX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@clinicflow.tn</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Tunis, Tunisie</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Liens utiles</h4>
              <div className="space-y-2 text-sm">
                <Link to="/auth" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Espace médecin
                </Link>
                <Link to="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Trouver un médecin
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClinicFlow. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
