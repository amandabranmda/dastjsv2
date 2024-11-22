import { Button } from "@/components/ui/button";
import { Contact2, MessageSquare } from "lucide-react";
import { StatusCard } from "@/components/StatusCard";
import { MetricCard } from "@/components/MetricCard";
import { useInstances } from "@/hooks/useInstances";

const Index = () => {
  const { data: instancesData, isLoading } = useInstances();

  const calculateOptinRate = () => {
    if (!instancesData?.totalClicks || !instancesData?.totalLeads) return "0";
    const rate = (instancesData.totalLeads / instancesData.totalClicks) * 100;
    return rate.toFixed(2);
  };

  const calculateRemainingMessages = () => {
    if (!instancesData?.totalSendingLimit || !instancesData?.totalLeads) return "0";
    const remaining = instancesData.totalSendingLimit - instancesData.totalLeads;
    return `Você ainda tem ${remaining} envios disponíveis`;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Zaps Dashboard
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="secondary" className="gap-2 text-sm sm:text-base flex-1 sm:flex-none hover:scale-105 transition-transform">
              <Contact2 className="w-4 h-4" />
              Contatos
            </Button>
            <Button variant="default" className="gap-2 text-sm sm:text-base flex-1 sm:flex-none bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
              Criar Instância
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="animate-fade-in [animation-delay:200ms]">
            <StatusCard 
              title="Instâncias Enviando" 
              value={isLoading ? "..." : instancesData?.sendingCount || 0} 
              type="sending" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:400ms]">
            <StatusCard 
              title="Instâncias Online" 
              value={isLoading ? "..." : instancesData?.onlineCount || 0} 
              type="online" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:600ms]">
            <StatusCard 
              title="❌verificarDesconexao" 
              value={isLoading ? "..." : instancesData?.closedCount || 0} 
              type="closed" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="animate-fade-in [animation-delay:800ms]">
            <MetricCard
              title="Cliques"
              value={isLoading ? "..." : instancesData?.totalClicks || 0}
              change="+45"
              type="preset"
            />
          </div>
          <div className="animate-fade-in [animation-delay:1000ms]">
            <MetricCard
              title="Leads"
              value={isLoading ? "..." : instancesData?.totalLeads || 0}
              change={`${calculateOptinRate()}% optin`}
              type="optin"
            />
          </div>
          <div className="animate-fade-in [animation-delay:1200ms]">
            <MetricCard
              title="Limite de envios"
              value={isLoading ? "..." : instancesData?.totalSendingLimit || 0}
              change={calculateRemainingMessages()}
              type="sales"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="animate-fade-in [animation-delay:1400ms]">
            <StatusCard 
              title="Aguardando Desbloqueio" 
              value={isLoading ? "..." : instancesData?.waitingUnlockCount || 0}
              type="closed" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:1600ms]">
            <MetricCard
              title="Chips Liberados"
              value="67%"
              change="+5.2%"
              type="optin"
            />
          </div>
          <div className="animate-fade-in [animation-delay:1800ms]">
            <MetricCard
              title="ROI"
              value="R$ 15.4k"
              change="+23.1%"
              type="sales"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="animate-fade-in [animation-delay:2000ms]">
            <MetricCard
              title="Engajamento"
              value="89%"
              change="+8.3%"
              type="preset"
            />
          </div>
          <div className="animate-fade-in [animation-delay:2200ms]">
            <MetricCard
              title="Retenção"
              value="78%"
              change="+3.7%"
              type="optin"
            />
          </div>
          <div className="animate-fade-in [animation-delay:2400ms]">
            <MetricCard
              title="Receita"
              value="R$ 22.8k"
              change="+15.4%"
              type="sales"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;