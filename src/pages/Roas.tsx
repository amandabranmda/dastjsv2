import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number;
  envios: number;
}

const Roas = () => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metricas-hot"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("9-metricasHot")
        .select("id,data,cliques,envios")
        .order("data", { ascending: false });

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
      <h1 className="text-2xl font-bold mb-6 text-white">Métricas Hot</h1>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Cliques</TableHead>
              <TableHead className="text-right">Envios</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics?.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell>
                  {new Date(metric.data).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  {metric.cliques.toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  {metric.envios.toLocaleString('pt-BR')}
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