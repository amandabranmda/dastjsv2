import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MetricasHot } from "@/types/metrics";
import { toast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";

export const useRoasMetrics = (dateRange: DateRange | undefined) => {
  const queryClient = useQueryClient();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metricas-hot', dateRange],
    queryFn: async () => {
      try {
        const dateInterval = [];
        if (dateRange?.from) {
          dateInterval.push(dateRange.from.toISOString().split('T')[0]);
        }
        if (dateRange?.to) {
          dateInterval.push(dateRange.to.toISOString().split('T')[0]);
        }

        let query = supabase
          .from("9-metricasHot")
          .select("id,data,cliques,envios,percentualCliques,vendas,valorAds,roas")
          .order("data", { ascending: false });

        if (dateInterval.length > 0) {
          query = query.gte("data", dateInterval[0]);
          if (dateInterval[1]) {
            query = query.lte("data", dateInterval[1]);
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        return data as MetricasHot[];
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar as métricas.",
        });
        return [];
      }
    },
  });

  const setupRealtimeSubscription = () => {
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
          toast({
            title: "Dados atualizados",
            description: "As métricas foram atualizadas em tempo real.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    metrics,
    isLoading,
    setupRealtimeSubscription
  };
};