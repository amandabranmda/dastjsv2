import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export const useInstances = () => {
  const { data, refetch, error } = useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      try {
        const [onlineResult, closedResult, sendingResult, leadsResult, clicksResult, limitsResult] = await Promise.all([
          supabase
            .from("1-chipsInstancias")
            .select("*")
            .eq("statusChip", "✅emProducao")
            .eq("statusInstancia", "open"),
          supabase
            .from("1-chipsInstancias")
            .select("*")
            .eq("statusChip", "❌verificarDesconexao"),
          supabase
            .from("1-chipsInstancias")
            .select("*")
            .eq("statusEnvios", true)
            .eq("statusInstancia", "open")
            .eq("projeto", "ProjetHotGPT"),
          supabase
            .from("1-chipsInstancias")
            .select("enviosDia")
            .eq("projeto", "ProjetHotGPT"),
          supabase
            .from("1-chipsInstancias")
            .select("cliquesRedirect")
            .eq("projeto", "ProjetHotGPT"),
          supabase
            .from("1-chipsInstancias")
            .select("limiteEnviosDia")
            .eq("projeto", "ProjetHotGPT")
            .eq("statusInstancia", "open")
        ]);

        // Check for errors in any of the results
        const results = [onlineResult, closedResult, sendingResult, leadsResult, clicksResult, limitsResult];
        for (const result of results) {
          if (result.error) {
            throw result.error;
          }
        }

        const totalLeads = leadsResult.data?.reduce((sum, row) => sum + (row.enviosDia || 0), 0) || 0;
        const totalClicks = clicksResult.data?.reduce((sum, row) => sum + (row.cliquesRedirect || 0), 0) || 0;
        const totalSendingLimit = limitsResult.data?.reduce((sum, row) => sum + (row.limiteEnviosDia || 0), 0) || 0;
        const availableSendingLimit = Math.round(totalSendingLimit * 0.35); // Calculate 35% of total limit

        return {
          onlineCount: onlineResult.data?.length || 0,
          closedCount: closedResult.data?.length || 0,
          sendingCount: sendingResult.data?.length || 0,
          totalLeads,
          totalClicks,
          totalSendingLimit: availableSendingLimit // Now returning 35% of the total limit
        };
      } catch (error) {
        console.error('Error fetching instances:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Houve um problema ao carregar as instâncias. Por favor, tente novamente.",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    gcTime: 0
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
          table: '1-chipsInstancias'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { data, isLoading: !data, error };
};