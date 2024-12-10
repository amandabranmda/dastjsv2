import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useState } from "react";
import { RoasHeader } from "@/components/RoasHeader";
import { RoasTable } from "@/components/RoasTable";
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

const Roas = () => {
  const [date, setDate] = useState<Date>();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metricas-hot", date],
    queryFn: async () => {
      let query = supabase
        .from("9-metricasHot")
        .select("*")
        .order("data", { ascending: false });

      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        console.log("Data formatada para busca:", formattedDate);
        query = query.eq("data", formattedDate);
      }

      const { data: queryData, error: queryError } = await query;

      if (queryError) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as métricas.",
          variant: "destructive",
        });
        throw queryError;
      }

      console.log("Dados retornados:", queryData);
      return queryData as MetricasHot[];
    },
  });

  return (
    <div className="container mx-auto p-6">
      <RoasHeader date={date} onDateSelect={setDate} />
      <RoasTable metrics={metrics} isLoading={isLoading} />
    </div>
  );
};

export default Roas;