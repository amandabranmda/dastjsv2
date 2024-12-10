import { MetricCard } from "@/components/MetricCard";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
}

interface MetricsPanelProps {
  metrics: MetricasHot[] | undefined;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  if (!metrics?.length) return null;

  const calculateMetrics = () => {
    const totalVendas = metrics.reduce((sum, metric) => sum + (metric.vendas || 0), 0);
    const totalGastos = metrics.reduce((sum, metric) => sum + (metric.valorAds || 0), 0);
    const totalEnvios = metrics.reduce((sum, metric) => sum + (metric.envios || 0), 0);
    const totalCliques = metrics.reduce((sum, metric) => sum + (metric.cliques || 0), 0);

    const validPercentualCliques = metrics.filter(m => m.percentualCliques !== null);
    const mediaPercentualCliques = validPercentualCliques.length
      ? validPercentualCliques.reduce((sum, metric) => sum + (metric.percentualCliques || 0), 0) / validPercentualCliques.length
      : 0;

    const mediaRoas = totalGastos > 0 ? totalVendas / totalGastos : 0;
    const mediaCpl = totalEnvios > 0 ? totalGastos / totalEnvios : 0;

    return {
      totalVendas: totalVendas.toFixed(2),
      totalGastos: totalGastos.toFixed(2),
      mediaRoas: mediaRoas.toFixed(2),
      mediaCpl: mediaCpl.toFixed(2),
      totalEnvios,
      totalCliques,
      mediaPercentualCliques: mediaPercentualCliques.toFixed(2)
    };
  };

  const metrics_data = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Total de Vendas"
        value={`R$ ${metrics_data.totalVendas}`}
        change={
          <div className="flex items-center gap-1 text-[#10B981]">
            <ArrowUpIcon className="w-4 h-4" />
          </div>
        }
        type="sales"
      />
      <MetricCard
        title="Total de Gastos"
        value={`R$ ${metrics_data.totalGastos}`}
        change={
          <div className="flex items-center gap-1 text-destructive">
            <ArrowDownIcon className="w-4 h-4" />
          </div>
        }
        type="padrao"
      />
      <MetricCard
        title="Média ROAS"
        value={metrics_data.mediaRoas}
        change={
          <div className="flex items-center gap-1 text-[#10B981]">
            <ArrowUpIcon className="w-4 h-4" />
          </div>
        }
        type="sales"
      />
      <MetricCard
        title="Média CPL"
        value={`R$ ${metrics_data.mediaCpl}`}
        change={
          <div className="flex items-center gap-1 text-[#10B981]">
            <ArrowUpIcon className="w-4 h-4" />
          </div>
        }
        type="padrao"
      />
      <MetricCard
        title="Total de Envios"
        value={metrics_data.totalEnvios}
        change={
          <div className="flex items-center gap-1 text-[#10B981]">
            <ArrowUpIcon className="w-4 h-4" />
          </div>
        }
        type="optin"
      />
      <MetricCard
        title="Total de Cliques"
        value={metrics_data.totalCliques}
        change={
          <div className="flex items-center gap-1 text-[#10B981]">
            <ArrowUpIcon className="w-4 h-4" />
          </div>
        }
        type="optin"
      />
      <MetricCard
        title="Média % Cliques"
        value={`${metrics_data.mediaPercentualCliques}%`}
        change={
          <div className="flex items-center gap-1 text-[#10B981]">
            <ArrowUpIcon className="w-4 h-4" />
          </div>
        }
        type="optin"
      />
    </div>
  );
}