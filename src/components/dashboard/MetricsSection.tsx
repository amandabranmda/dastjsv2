import { MetricCard } from "@/components/MetricCard";

interface MetricsSectionProps {
  instancesData: any;
  isLoading: boolean;
}

export function MetricsSection({ instancesData, isLoading }: MetricsSectionProps) {
  const calculateOptinRate = () => {
    if (!instancesData?.totalLeads || !instancesData?.totalClicks) return "0";
    const rate = (instancesData.totalLeads / instancesData.totalClicks) * 100;
    return rate.toFixed(1);
  };

  const calculateRemainingMessages = () => {
    if (!instancesData?.totalSendingLimit) return "0";
    return `${instancesData.totalSendingLimit} restantes`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
      <div className="animate-fade-in [animation-delay:800ms]">
        <MetricCard
          title="Cliques"
          value={isLoading ? "..." : instancesData?.totalClicks || 0}
          change="+45"
          type="sales"
        />
      </div>
      <div className="animate-fade-in [animation-delay:1000ms]">
        <MetricCard
          title="Leads"
          value={isLoading ? "..." : instancesData?.totalLeads || 0}
          change={`${calculateOptinRate()}% optin`}
          type="leads"
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
  );
}