import { Button } from "@/components/ui/button";
import { Contact2, MessageSquare } from "lucide-react";
import { StatusCard } from "@/components/StatusCard";
import { MetricCard } from "@/components/MetricCard";
import { LeadChart } from "@/components/LeadChart";
import { InstanceTable } from "@/components/InstanceTable";
import { useInstances } from "@/hooks/useInstances";

const Index = () => {
  const { data: instancesData, isLoading } = useInstances();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Zaps Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="secondary" className="gap-2">
              <Contact2 className="w-4 h-4" />
              Contatos
            </Button>
            <Button variant="default" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Criar Instância
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard 
            title="Instâncias Online" 
            value={isLoading ? "..." : instancesData?.onlineCount || 0} 
            type="online" 
          />
          <StatusCard 
            title="Instâncias Close" 
            value={isLoading ? "..." : instancesData?.closedCount || 0} 
            type="closed" 
          />
          <StatusCard 
            title="Instâncias Enviando" 
            value={isLoading ? "..." : instancesData?.sendingCount || 0} 
            type="sending" 
          />
        </div>

        {/* Chart */}
        <LeadChart />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Cliques"
            value="4015"
            change="+45"
            type="preset"
          />
          <MetricCard
            title="Leads"
            value={isLoading ? "..." : instancesData?.totalLeads || 0}
            change="+29.66% optin"
            type="optin"
          />
          <MetricCard
            title="Vendas Realizadas"
            value="45"
            change="R$ 12.5 ticket médio"
            type="sales"
          />
        </div>

        {/* Instance Table */}
        <InstanceTable />
      </div>
    </div>
  );
};

export default Index;