
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Produits from "./pages/Produits";
import Livraison from "./pages/Livraison";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/politique-cookies" element={<PolitiqueCookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
