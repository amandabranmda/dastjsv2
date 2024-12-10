import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { RoasHeader } from "@/components/RoasHeader";
import { RoasTable } from "@/components/RoasTable";
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

const Roas = () => {
  const [date, setDate] = useState<Date>();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metricas-hot", date],
    queryFn: async () => {
      let query = supabase
        .from("9-metricasHot")
        .select("id,data,cliques,envios,percentualCliques,vendas,valorAds")
        .order("data", { ascending: false });

      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        console.log("Data formatada para busca:", formattedDate);
        query = query.eq("data", formattedDate);
      }

      const { data: queryData, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      console.log("Dados retornados:", queryData);
      return queryData as MetricasHot[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: '9-metricasHot'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['metricas-hot'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto p-6 space-y-8">
        <div className="backdrop-blur-sm bg-card/10 rounded-lg p-6 shadow-lg">
          <RoasHeader date={date} onDateSelect={setDate} />
        </div>
        <RoasTable metrics={metrics} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Roas;