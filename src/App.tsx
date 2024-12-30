import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Metrics from "./pages/Metrics";
import Instances from "./pages/Instances";
import Roas from "./pages/Roas";
import { useState, useEffect } from "react";
import { BackToTop } from "./components/BackToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const App = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <Index />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/metrics" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <Metrics />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/instances" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <Instances />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <div>Página de Mensagens em Construção</div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/contacts" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <div>Página de Contatos em Construção</div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <div>Página de Relatórios em Construção</div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <div>Página de Configurações em Construção</div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/help" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <div>Página de Ajuda em Construção</div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/roas" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full">
                    <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                      <Roas />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
            <BackToTop />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;