import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MetricasHot } from "@/types/metrics";
import { toast } from "@/components/ui/use-toast";

export const useRoasUpdate = (metrics: MetricasHot[] | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateRoasValues = async () => {
      if (!metrics) return;

      for (const metric of metrics) {
        if (metric.vendas && metric.valorAds && metric.valorAds > 0) {
          const roasValue = metric.vendas / metric.valorAds;
          
          if (roasValue !== metric.roas) {
            try {
              const { error } = await supabase
                .from('9-metricasHot')
                .update({ roas: roasValue })
                .eq('data', metric.data);

              if (error) throw error;

              console.log(`ROAS atualizado para data ${metric.data}: ${roasValue}`);
            } catch (error) {
              console.error('Erro ao atualizar ROAS:', error);
              toast({
                title: "Erro",
                description: `Erro ao atualizar ROAS para ${metric.data}`,
                variant: "destructive",
              });
            }
          }
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['metricas-hot'] });
    };

    updateRoasValues();
  }, [metrics, queryClient]);
};