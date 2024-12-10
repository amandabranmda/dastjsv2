import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Contact2, MessageSquare, ChartBar, Cpu, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Zaps Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/instances">
            <Button variant="secondary" className="w-full gap-2 text-lg bg-[#9b87f5] hover:bg-[#8b77e5] transition-colors">
              <Cpu className="w-5 h-5" />
              Gerenciar Instâncias
            </Button>
          </Link>
          
          <Link to="/metrics">
            <Button variant="secondary" className="w-full gap-2 text-lg bg-[#10B981] hover:bg-[#059669] transition-colors">
              <ChartBar className="w-5 h-5" />
              Ver Métricas
            </Button>
          </Link>

          <Link to="/contacts">
            <Button variant="secondary" className="w-full gap-2 text-lg bg-[#0EA5E9] hover:bg-[#0284C7] transition-colors">
              <Contact2 className="w-5 h-5" />
              Contatos
            </Button>
          </Link>

          <Link to="/messages">
            <Button variant="secondary" className="w-full gap-2 text-lg bg-[#F97316] hover:bg-[#EA580C] transition-colors">
              <MessageSquare className="w-5 h-5" />
              Mensagens
            </Button>
          </Link>

          <Link to="/roas">
            <Button variant="secondary" className="w-full gap-2 text-lg bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors">
              <TrendingUp className="w-5 h-5" />
              Métricas ROAS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;