import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RoasTableHeader } from "./roas/TableHeader";
import { RoasTableRow } from "./roas/TableRow";

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando métricas...</div>;
  }

  const handleUpdateVendas = async (metric: MetricasHot, newValue: number) => {
    try {
      const { error } = await supabase
        .from('9-metricasHot')
        .update({ vendas: newValue })
        .eq('data', metric.data);

      if (error) throw error;

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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <RoasTableHeader />
        <TableBody>
          {metrics?.map((metric) => (
            <RoasTableRow
              key={metric.id}
              metric={metric}
              onUpdateVendas={handleUpdateVendas}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}