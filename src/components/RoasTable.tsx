import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RoasTableHeader } from "./roas/TableHeader";
import { RoasTableRow } from "./roas/TableRow";
import { useQueryClient } from "@tanstack/react-query";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
}

interface RoasTableProps {
  metrics: MetricasHot[] | undefined;
  isLoading: boolean;
}

export function RoasTable({ metrics, isLoading }: RoasTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 bg-primary/20 rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  const handleUpdateVendas = async (metric: MetricasHot, newValue: number) => {
    try {
      const { error } = await supabase
        .from('9-metricasHot')
        .update({ vendas: newValue })
        .eq('data', metric.data);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['metricas-hot'] });

      toast({
        title: "Sucesso",
        description: "Valor atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o valor",
        variant: "destructive",
      });
    }
  };

  const handleUpdateValorAds = async (metric: MetricasHot, newValue: number) => {
    try {
      const { error } = await supabase
        .from('9-metricasHot')
        .update({ valorAds: newValue })
        .eq('data', metric.data);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['metricas-hot'] });

      toast({
        title: "Sucesso",
        description: "Valor atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o valor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-lg border bg-gradient-to-b from-card/60 to-card/30 backdrop-blur-xl shadow-xl">
        <div className="p-1">
          <Table>
            <RoasTableHeader />
            <TableBody>
              {metrics?.map((metric) => (
                <RoasTableRow
                  key={metric.id}
                  metric={metric}
                  onUpdateVendas={handleUpdateVendas}
                  onUpdateValorAds={handleUpdateValorAds}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}