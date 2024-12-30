import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Metrics from "./pages/Metrics";
import Instances from "./pages/Instances";
import Roas from "./pages/Roas";
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex min-h-screen w-full">
                  <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                    <Index />
                  </main>
                </div>
              }
            />
            <Route
              path="/metrics"
              element={
                <div className="flex min-h-screen w-full">
                  <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                    <Metrics />
                  </main>
                </div>
              }
            />
            <Route
              path="/instances"
              element={
                <div className="flex min-h-screen w-full">
                  <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                    <Instances />
                  </main>
                </div>
              }
            />
            <Route
              path="/roas"
              element={
                <div className="flex min-h-screen w-full">
                  <main className="flex-1 px-2 py-4 sm:p-8 overflow-x-hidden">
                    <Roas />
                  </main>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BackToTop />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;