import { MetricCard } from "@/components/MetricCard";
import { StatusCard } from "@/components/StatusCard";
import { useInstances } from "@/hooks/useInstances";

const Metrics = () => {
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

  const calculateIdleInstances = () => {
    if (!instancesData?.onlineCount || !instancesData?.sendingCount) return "0";
    const idle = instancesData.onlineCount - instancesData.sendingCount;
    return idle;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Métricas</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="animate-fade-in [animation-delay:200ms]">
          <MetricCard
            title="Cliques"
            value={isLoading ? "..." : instancesData?.totalClicks || 0}
            change="+45"
            type="padrao"
          />
        </div>
        <div className="animate-fade-in [animation-delay:400ms]">
          <MetricCard
            title="Leads"
            value={isLoading ? "..." : instancesData?.totalLeads || 0}
            change={`${calculateOptinRate()}% optin`}
            type="optin"
          />
        </div>
        <div className="animate-fade-in [animation-delay:600ms]">
          <MetricCard
            title="Limite de envios"
            value={isLoading ? "..." : instancesData?.totalSendingLimit || 0}
            change={calculateRemainingMessages()}
            type="sales"
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Status das Instâncias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="animate-fade-in [animation-delay:800ms]">
            <StatusCard 
              title="Instâncias Online" 
              value={isLoading ? "..." : instancesData?.onlineCount || 0} 
              type="online" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:1000ms]">
            <StatusCard 
              title="Instâncias Enviando" 
              value={isLoading ? "..." : instancesData?.sendingCount || 0} 
              type="sending" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:1200ms]">
            <StatusCard
              title="Instâncias Aguardando"
              value={isLoading ? "..." : calculateIdleInstances()}
              type="online"
            />
          </div>
          <div className="animate-fade-in [animation-delay:1400ms]">
            <StatusCard 
              title="❌verificarDesconexao" 
              value={isLoading ? "..." : instancesData?.closedCount || 0} 
              type="closed" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:1600ms]">
            <StatusCard 
              title="Aguardando Desbloqueio" 
              value={isLoading ? "..." : instancesData?.waitingUnlockCount || 0}
              type="closed" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:1800ms]">
            <StatusCard 
              title="Chips Liberados" 
              value={isLoading ? "..." : instancesData?.releasedCount || 0}
              type="closed" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;