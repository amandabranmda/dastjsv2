import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/messages" element={<div className="flex min-h-screen"><Sidebar /><main className="flex-1 ml-64 p-8">Página de Mensagens em Construção</main></div>} />
          <Route path="/contacts" element={<div className="flex min-h-screen"><Sidebar /><main className="flex-1 ml-64 p-8">Página de Contatos em Construção</main></div>} />
          <Route path="/reports" element={<div className="flex min-h-screen"><Sidebar /><main className="flex-1 ml-64 p-8">Página de Relatórios em Construção</main></div>} />
          <Route path="/settings" element={<div className="flex min-h-screen"><Sidebar /><main className="flex-1 ml-64 p-8">Página de Configurações em Construção</main></div>} />
          <Route path="/help" element={<div className="flex min-h-screen"><Sidebar /><main className="flex-1 ml-64 p-8">Página de Ajuda em Construção</main></div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;