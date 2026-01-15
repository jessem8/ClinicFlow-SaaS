import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Send,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  sentAt: Date;
  clicked: boolean;
}

const mockReviewRequests: ReviewRequest[] = [
  { id: "1", patientName: "Sami Ben Amor", patientPhone: "+216 98 123 456", sentAt: new Date(2024, 0, 15), clicked: true },
  { id: "2", patientName: "Amira Khelifi", patientPhone: "+216 22 456 789", sentAt: new Date(2024, 0, 14), clicked: false },
  { id: "3", patientName: "Youssef Mejri", patientPhone: "+216 55 789 012", sentAt: new Date(2024, 0, 12), clicked: true },
  { id: "4", patientName: "Fatma Bouazizi", patientPhone: "+216 99 234 567", sentAt: new Date(2024, 0, 10), clicked: true },
];

const frenchTemplate = "Bonjour {patient_name}, merci pour votre visite ! Si vous êtes satisfait(e), un avis Google nous aiderait beaucoup : {review_url}";
const arabicTemplate = "مرحبا {patient_name}، شكرا على زيارتك! إذا كنت راضيًا، سيساعدنا تقييم على Google كثيرًا: {review_url}";

export default function PortalReviews() {
  const navigate = useNavigate();
  const [reviewRequests] = useState(mockReviewRequests);
  const [googleReviewUrl, setGoogleReviewUrl] = useState("https://g.page/r/...");
  const [frTemplate, setFrTemplate] = useState(frenchTemplate);
  const [arTemplate, setArTemplate] = useState(arabicTemplate);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSaveSettings = () => {
    toast.success("Paramètres enregistrés");
  };

  const stats = {
    totalSent: 142,
    clicked: 89,
    clickRate: 63,
    googleRating: 4.9,
    googleReviews: 128,
  };

  return (
    <PortalLayout userName="Dr. Ahmed Benali" onLogout={handleLogout}>
      <div className="space-y-8 animate-fade-in">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Avis & Réputation</h1>
            <p className="text-muted-foreground mt-1">Gérez votre e-réputation et vos avis Google</p>
          </div>
          <Button
            onClick={() => window.open(googleReviewUrl, "_blank")}
            className="bg-primary hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir ma page Google
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="premium-card bg-gradient-to-br from-white to-amber-50/50 border-l-4 border-l-amber-400">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Note Google</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-3xl font-bold text-gray-900">{stats.googleRating}</h3>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stats.googleReviews} avis total</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-white border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Demandes envoyées</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSent}</h3>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12 this week
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-white border-l-4 border-l-blue-400">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux de clic</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.clickRate}%</h3>
                  <p className="text-xs text-muted-foreground mt-1">Performance excellente</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card bg-white border-l-4 border-l-purple-400">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">98%</h3>
                  <p className="text-xs text-muted-foreground mt-1">Basé sur les retours</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="premium-card border-0 shadow-lg shadow-gray-100/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Configuration des messages
                </CardTitle>
                <CardDescription>
                  Personnalisez les SMS envoyés automatiquement après chaque consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lien Google Review (Place ID)</label>
                  <div className="flex gap-2">
                    <Input
                      value={googleReviewUrl}
                      onChange={(e) => setGoogleReviewUrl(e.target.value)}
                      placeholder="https://g.page/r/..."
                      className="bg-muted/30 border-border/50"
                    />
                    <Button variant="outline" size="icon" onClick={() => window.open(googleReviewUrl, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="fr" className="w-full">
                  <TabsList className="bg-muted/50 w-full justify-start p-1 h-auto">
                    <TabsTrigger value="fr" className="flex-1">Français</TabsTrigger>
                    <TabsTrigger value="ar" className="flex-1">العربية</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fr" className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Message en français</label>
                      <span className="text-xs text-muted-foreground">134 caractères</span>
                    </div>
                    <Textarea
                      value={frTemplate}
                      onChange={(e) => setFrTemplate(e.target.value)}
                      rows={4}
                      className="bg-white resize-none focus:ring-primary/20"
                    />
                  </TabsContent>
                  <TabsContent value="ar" className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Message en arabe</label>
                      <span className="text-xs text-muted-foreground">~130 caractères</span>
                    </div>
                    <Textarea
                      value={arTemplate}
                      onChange={(e) => setArTemplate(e.target.value)}
                      rows={4}
                      dir="rtl"
                      className="bg-white resize-none focus:ring-primary/20 font-arabic"
                    />
                  </TabsContent>
                </Tabs>

                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2">
                  <span className="font-bold">Info:</span>
                  <p>Utilisez {"{patient_name}"} pour le nom du patient et {"{review_url}"} pour votre lien.</p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary-600">
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent List Column */}
          <div className="space-y-6">
            <Card className="premium-card h-full border-0 shadow-lg shadow-gray-100/50">
              <CardHeader>
                <CardTitle className="text-lg">Derniers envois</CardTitle>
                <CardDescription>Historique récent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center shadow-sm text-sm font-bold text-primary">
                          {request.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{request.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(request.sentAt, "d MMM", { locale: fr })} • {format(request.sentAt, "HH:mm")}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={request.clicked
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                        }
                      >
                        {request.clicked ? "Cliqué" : "Envoyé"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                    Voir tout l'historique
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