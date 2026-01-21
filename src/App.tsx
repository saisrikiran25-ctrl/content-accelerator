import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ContentBrief from "./pages/ContentBrief";
import ContentLibrary from "./pages/ContentLibrary";
import ContentGenerator from "./pages/ContentGenerator";
import ContentCalendar from "./pages/ContentCalendar";
import BrandVoice from "./pages/BrandVoice";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CommandPalette from "./components/CommandPalette";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/brief" element={<ContentBrief />} />
            <Route path="/library" element={<ContentLibrary />} />
            <Route path="/generate" element={<ContentGenerator />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/brand-voice" element={<BrandVoice />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
