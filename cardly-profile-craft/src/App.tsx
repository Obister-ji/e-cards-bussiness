
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import ViewCard from "./pages/ViewCard";
import FaviconTest from "./pages/FaviconTest";
import DebugSharing from "./pages/DebugSharing";
import PhotoUploadTest from "./components/PhotoUploadTest";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { faviconManager } from "./utils/faviconManager";
// Create a client
const queryClient = new QueryClient();

const App = () => {
  // Initialize favicon from logo folder
  useEffect(() => {
    faviconManager.initializeFavicons();
  }, []);

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>

              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/view/:id" element={<ViewCard />} />
                  <Route path="/favicon-test" element={<FaviconTest />} />
                  <Route path="/debug-sharing" element={<DebugSharing />} />
                  <Route path="/photo-upload-test" element={<PhotoUploadTest />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
