import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
  roas: number | null;
}

interface RoasTableProps {
  metrics: MetricasHot[] | undefined;
  isLoading: boolean;
}

export function RoasTable({ metrics, isLoading }: RoasTableProps) {
  useEffect(() => {
    const updateRoasValues = async () => {
      if (!metrics) return;

      for (const metric of metrics) {
        const calculatedRoas = calculateRoas(metric.vendas, metric.valorAds);
        
        // Only update if the calculated ROAS is different from stored ROAS
        if (calculatedRoas !== metric.roas) {
          const { error } = await supabase
            .from("9-metricasHot")
            .update({ roas: calculatedRoas })
            .eq("id", metric.id);

          if (error) {
            console.error("Error updating ROAS:", error);
            toast({
              title: "Erro ao atualizar ROAS",
              description: "Não foi possível salvar o valor do ROAS.",
              variant: "destructive",
            });
          }
        }
      }
    };

    updateRoasValues();
  }, [metrics]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando métricas...</div>;
  }

  const calculateRoas = (vendas: number | null, valorAds: number | null): number => {
    if (!vendas || !valorAds || valorAds === 0) return 0;
    return Number((vendas / valorAds).toFixed(2));
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Cliques</TableHead>
            <TableHead className="text-right">Envios</TableHead>
            <TableHead className="text-right">% Cliques</TableHead>
            <TableHead className="text-right">Vendas</TableHead>
            <TableHead className="text-right">Valor Ads</TableHead>
            <TableHead className="text-right">ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics?.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell>{metric.data}</TableCell>
              <TableCell className="text-right">{metric.cliques ?? '0'}</TableCell>
              <TableCell className="text-right">{metric.envios ?? '0'}</TableCell>
              <TableCell className="text-right">
                {metric.percentualCliques ? metric.percentualCliques.toFixed(2) : '0.00'}
              </TableCell>
              <TableCell className="text-right">{metric.vendas ?? '0'}</TableCell>
              <TableCell className="text-right">{metric.valorAds ?? '0'}</TableCell>
              <TableCell className="text-right">{metric.roas ?? '0.00'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}