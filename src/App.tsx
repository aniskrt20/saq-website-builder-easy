import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SettingsPage from "./pages/SettingsPage";
import TasbihPage from "./pages/TasbihPage";
import AdhkarPage from "./pages/AdhkarPage";
import DuasPage from "./pages/DuasPage";
import RadioPage from "./pages/RadioPage";
import VideosPage from "./pages/VideosPage";
import HadithPage from "./pages/HadithPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CopyrightPage from "./pages/CopyrightPage";
import FullQuranPage from "./pages/FullQuranPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tasbih" element={<TasbihPage />} />
          <Route path="/adhkar" element={<AdhkarPage />} />
          <Route path="/duas" element={<DuasPage />} />
          <Route path="/quran" element={<FullQuranPage />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/hadith" element={<HadithPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/copyright" element={<CopyrightPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
