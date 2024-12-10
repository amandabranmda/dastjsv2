import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, eachDayOfInterval } from "date-fns";
import { useState, useEffect } from "react";
import { RoasHeader } from "@/components/RoasHeader";
import { RoasTable } from "@/components/RoasTable";
import { MetricsPanel } from "@/components/roas/MetricsPanel";
import { useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

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
  const [dateRange, setDateRange] = useState<DateRange>();
  const [dateInterval, setDateInterval] = useState<Date[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const range = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      });
      setDateInterval(range);
    } else {
      setDateInterval([]);
    }
  }, [dateRange]);

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metricas-hot", dateInterval],
    queryFn: async () => {
      let query = supabase
        .from("9-metricasHot")
        .select("id,data,cliques,envios,percentualCliques,vendas,valorAds")
        .order("data", { ascending: false });

      if (dateInterval.length > 0) {
        const formattedDates = dateInterval.map(d => format(d, "yyyy-MM-dd"));
        console.log("Datas formatadas para busca:", formattedDates);
        query = query.in("data", formattedDates);
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
          <RoasHeader dateRange={dateRange} onDateRangeSelect={setDateRange} />
        </div>
        
        {metrics && metrics.length > 0 && (
          <div className="backdrop-blur-sm bg-card/10 rounded-lg p-6 shadow-lg animate-fade-in">
            <MetricsPanel metrics={metrics} />
          </div>
        )}

        <RoasTable metrics={metrics} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Roas;