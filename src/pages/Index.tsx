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
    <div className="max-w-full mx-auto space-y-4 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-semibold">Zaps Dashboard</h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button variant="secondary" className="gap-2 text-sm sm:text-base flex-1 sm:flex-none">
            <Contact2 className="w-4 h-4" />
            Contatos
          </Button>
          <Button variant="default" className="gap-2 text-sm sm:text-base flex-1 sm:flex-none">
            <MessageSquare className="w-4 h-4" />
            Criar Instância
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatusCard 
          title="Instâncias Enviando" 
          value={isLoading ? "..." : instancesData?.sendingCount || 0} 
          type="sending" 
        />
        <StatusCard 
          title="Instâncias Online" 
          value={isLoading ? "..." : instancesData?.onlineCount || 0} 
          type="online" 
        />
        <StatusCard 
          title="❌verificarDesconexao" 
          value={isLoading ? "..." : instancesData?.closedCount || 0} 
          type="closed" 
        />
      </div>

      {/* Metric Cards - First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard
          title="Cliques"
          value={isLoading ? "..." : instancesData?.totalClicks || 0}
          change="+45"
          type="preset"
        />
        <MetricCard
          title="Leads"
          value={isLoading ? "..." : instancesData?.totalLeads || 0}
          change={`${calculateOptinRate()}% optin`}
          type="optin"
        />
        <MetricCard
          title="Limite de envios"
          value={isLoading ? "..." : instancesData?.totalSendingLimit || 0}
          change={calculateRemainingMessages()}
          type="sales"
        />
      </div>

      {/* Metric Cards - Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatusCard 
          title="Aguardando Desbloqueio" 
          value={isLoading ? "..." : instancesData?.waitingUnlockCount || 0}
          type="closed" 
        />
        <MetricCard
          title="Taxa de Resposta"
          value="67%"
          change="+5.2%"
          type="optin"
        />
        <MetricCard
          title="ROI"
          value="R$ 15.4k"
          change="+23.1%"
          type="sales"
        />
      </div>

      {/* Metric Cards - Third Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard
          title="Engajamento"
          value="89%"
          change="+8.3%"
          type="preset"
        />
        <MetricCard
          title="Retenção"
          value="78%"
          change="+3.7%"
          type="optin"
        />
        <MetricCard
          title="Receita"
          value="R$ 22.8k"
          change="+15.4%"
          type="sales"
        />
      </div>
    </div>
  );
};

export default Index;