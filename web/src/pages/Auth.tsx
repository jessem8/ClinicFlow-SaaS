import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Shield,
  Calendar,
  Bell,
  Star,
  CheckCircle2,
  Stethoscope,
  Mail,
  Lock,
  User,
  Phone
} from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Email ou mot de passe incorrect");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Connexion réussie !");
      navigate("/portal");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupEmail || !signupPassword || !signupFullName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/portal`;

      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupFullName,
            phone: signupPhone,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Cet email est déjà utilisé");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Compte créé ! Vérifiez votre email.");
      setMode("login");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-gray-950 to-gray-950" />
        <div className="absolute top-0 left-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-y-1/3" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px]">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ClinicFlow</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {mode === "login" ? "Bon retour !" : "Créez votre compte"}
            </h1>
            <p className="text-gray-400 text-lg">
              {mode === "login"
                ? "Accédez à votre espace médecin"
                : "Rejoignez +2,500 médecins en Tunisie"}
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl">
            <CardContent className="p-8">
              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300 text-sm">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="docteur@exemple.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-gray-300 text-sm">
                        Mot de passe
                      </Label>
                      <button type="button" className="text-sm text-primary hover:text-primary-400 transition-colors">
                        Oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary-600 shadow-lg shadow-primary/25"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Se connecter
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-300 text-sm">
                      Nom complet
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="signup-name"
                        placeholder="Dr. Ahmed Benali"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-300 text-sm">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="docteur@exemple.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-gray-300 text-sm">
                        Téléphone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+216"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-300 text-sm">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="h-14 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/10 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary-600 shadow-lg shadow-primary/25"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Créer mon compte
                  </Button>
                </form>
              )}

              {/* Toggle */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <span className="text-gray-400">
                  {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
                </span>
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="ml-2 text-primary font-semibold hover:text-primary-400 transition-colors"
                >
                  {mode === "login" ? "S'inscrire" : "Se connecter"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Essai gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Données sécurisées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Features (Desktop Only) */}
      <div className="hidden xl:flex xl:w-[45%] relative items-center justify-center p-12">
        <div className="max-w-md space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Plateforme #1 en Tunisie
            </span>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Gérez votre cabinet comme un pro
            </h2>
            <p className="text-xl text-gray-400">
              Rejoignez les médecins qui économisent des heures chaque semaine
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            {[
              { icon: Calendar, title: "Réservation 24/7", desc: "Vos patients réservent en ligne à tout moment" },
              { icon: Bell, title: "Rappels automatiques", desc: "40% moins d'absences grâce aux SMS" },
              { icon: Star, title: "Avis Google", desc: "Collectez des avis automatiquement" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-gray-950 flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-400 text-sm mt-1">Rejoint par +2,500 médecins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home - Fixed */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden sm:inline">Retour</span>
      </Link>
    </div>
  );
}
