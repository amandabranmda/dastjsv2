import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
}

const Roas = () => {
  const [date, setDate] = useState<Date>();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metricas-hot", date],
    queryFn: async () => {
      let query = supabase
        .from("9-metricasHot")
        .select("id,data,cliques,envios,percentualCliques,vendas,valorAds")
        .order("data", { ascending: false });

      if (date) {
        // Formata a data para o formato dd-MM-yyyy para corresponder ao formato do banco
        const formattedDate = format(date, "dd-MM-yyyy");
        console.log("Data formatada para busca:", formattedDate);
        query = query.eq("data", formattedDate);
      }

      const { data: queryData, error: queryError } = await query;

      if (queryError) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar métricas",
          description: queryError.message,
        });
        throw queryError;
      }

      console.log("Dados retornados:", queryData);
      return queryData as MetricasHot[];
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Métricas Hot</h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics?.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell>
                  {metric.data}
                </TableCell>
                <TableCell className="text-right">
                  {metric.cliques ?? '0'}
                </TableCell>
                <TableCell className="text-right">
                  {metric.envios ?? '0'}
                </TableCell>
                <TableCell className="text-right">
                  {metric.percentualCliques ? metric.percentualCliques.toFixed(2) : '0.00'}
                </TableCell>
                <TableCell className="text-right">
                  {metric.vendas ?? '0'}
                </TableCell>
                <TableCell className="text-right">
                  {metric.valorAds ?? '0'}
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