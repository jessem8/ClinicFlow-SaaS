import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import DoctorProfile from "./pages/DoctorProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import Auth from "./pages/Auth";
import PortalDashboard from "./pages/portal/Dashboard";
import PortalCalendar from "./pages/portal/Calendar";
import PortalPatients from "./pages/portal/Patients";
import PortalAvailability from "./pages/portal/Availability";
import PortalReviews from "./pages/portal/Reviews";
import NotFound from "./pages/NotFound";
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const configureSystemBars = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
        console.warn("System bar plugins not available or failed", e);
      }
    };
    configureSystemBars();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - Mobile redirects home to auth */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/d/:slug" element={<DoctorProfile />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            <Route path="/auth" element={<Auth />} />

            {/* Doctor Portal Routes */}
            <Route path="/portal" element={<PortalDashboard />} />
            <Route path="/portal/calendar" element={<PortalCalendar />} />
            <Route path="/portal/patients" element={<PortalPatients />} />
            <Route path="/portal/availability" element={<PortalAvailability />} />
            <Route path="/portal/reviews" element={<PortalReviews />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
