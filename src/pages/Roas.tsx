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
    // Subscribe to ALL changes in the table
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
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['metricas-hot'] });
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="container mx-auto p-6">
      <RoasHeader date={date} onDateSelect={setDate} />
      <RoasTable metrics={metrics} isLoading={isLoading} />
    </div>
  );
};

export default Roas;