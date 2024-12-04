import { MetricCard } from "@/components/MetricCard";
import { Clock } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Métricas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="animate-fade-in [animation-delay:800ms]">
          <MetricCard
            title="Cliques"
            value={isLoading ? "..." : instancesData?.totalClicks || 0}
            change="+45"
            type="padrao"
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
    </div>
  );
};

export default Metrics;