import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
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

export default App;
