import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Index from "./pages/Index";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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
            {!isFullScreen && isSidebarVisible && <Sidebar />}
            <main className={`flex-1 ${!isFullScreen && isSidebarVisible ? 'ml-64' : ''} p-8`}>
              <Button
                variant="outline"
                size="icon"
                className="mb-4"
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Routes>
                <Route path="/" element={<Index />} />
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