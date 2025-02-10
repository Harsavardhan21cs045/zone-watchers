
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import ControllerApp from "./pages/ControllerApp";
import OfficialApp from "./pages/OfficialApp";
import OfficialLogin from "./pages/OfficialLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const officialId = localStorage.getItem('officialId');
  
  if (!officialId) {
    return <Navigate to="/official/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`${isMobile ? 'h-[100dvh] overflow-hidden' : ''}`}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/controller" element={<ControllerApp />} />
              <Route path="/official/login" element={<OfficialLogin />} />
              <Route
                path="/official"
                element={
                  <ProtectedRoute>
                    <OfficialApp />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
