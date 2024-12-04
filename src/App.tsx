import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Metrics from "./pages/Metrics";
import Instances from "./pages/Instances";
import { useState, useEffect } from "react";

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen">
            <main className="flex-1 p-8">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/instances" element={<Instances />} />
                <Route path="/messages" element={<div>Página de Mensagens em Construção</div>} />
                <Route path="/contacts" element={<div>Página de Contatos em Construção</div>} />
                <Route path="/reports" element={<div>Página de Relatórios em Construção</div>} />
                <Route path="/settings" element={<div>Página de Configurações em Construção</div>} />
                <Route path="/help" element={<div>Página de Ajuda em Construção</div>} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;