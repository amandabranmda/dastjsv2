import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const useInstances = () => {
  const { data, refetch } = useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
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
      ]);

      if (onlineResult.error) throw onlineResult.error;
      if (closedResult.error) throw closedResult.error;
      if (sendingResult.error) throw sendingResult.error;
      if (leadsResult.error) throw leadsResult.error;
      if (clicksResult.error) throw clicksResult.error;
      if (limitsResult.error) throw limitsResult.error;

      const totalLeads = leadsResult.data.reduce((sum, row) => sum + (row.enviosDia || 0), 0);
      const totalClicks = clicksResult.data.reduce((sum, row) => sum + (row.cliquesRedirect || 0), 0);
      const totalSendingLimit = limitsResult.data.reduce((sum, row) => sum + (row.limiteEnviosDia || 0), 0);

      return {
        onlineCount: onlineResult.data?.length || 0,
        closedCount: closedResult.data?.length || 0,
        sendingCount: sendingResult.data?.length || 0,
        totalLeads,
        totalClicks,
        totalSendingLimit
      };
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('instances-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: '1-chipsInstancias'
        },
        (payload) => {
          console.log('Change received!', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from realtime updates');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { data, isLoading: !data };
};