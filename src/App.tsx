import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/brief" 
              element={<ComingSoon title="Content Brief" description="Create AI-powered content briefs with vertical-specific intelligence." />} 
            />
            <Route 
              path="/library" 
              element={<ComingSoon title="Content Library" description="Browse, manage, and organize all your generated content." />} 
            />
            <Route 
              path="/calendar" 
              element={<ComingSoon title="Content Calendar" description="Schedule and publish content across multiple channels." />} 
            />
            <Route 
              path="/analytics" 
              element={<ComingSoon title="Analytics" description="Track performance, SEO scores, and ROI of your content." />} 
            />
            <Route 
              path="/brand-voice" 
              element={<ComingSoon title="Brand Voice" description="Train the AI to match your unique writing style." />} 
            />
            <Route 
              path="/settings" 
              element={<ComingSoon title="Settings" description="Manage your account, integrations, and preferences." />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
