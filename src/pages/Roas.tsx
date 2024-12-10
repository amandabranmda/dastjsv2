import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface MetricasHot {
  id: number;
  created_at: string;
  valor_investido: number;
  valor_faturado: number;
  roas: number;
  lucro: number;
}

const Roas = () => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metricas-hot"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metricas_hot")  // Alterado de "metricas hot" para "metricas_hot"
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar métricas",
          description: error.message,
        });
        throw error;
      }

      return data as MetricasHot[];
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando métricas...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar métricas</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Métricas ROAS</h1>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor Investido</TableHead>
              <TableHead className="text-right">Valor Faturado</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">Lucro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics?.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell>
                  {new Date(metric.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metric.valor_investido)}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metric.valor_faturado)}
                </TableCell>
                <TableCell className="text-right">
                  {metric.roas.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metric.lucro)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Roas;