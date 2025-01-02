import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { toast } from "sonner";

export const useInstances = () => {
  const { data, refetch, error } = useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      try {
        const [onlineResult, closedResult, sendingResult, leadsResult, clicksResult, limitsResult, waitingUnlockResult, releasedResult] = await Promise.all([
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
            .eq("statusInstancia", "open"),
          supabase
            .from("1-chipsInstancias")
            .select("*")
            .eq("statusChip", "aguardando desbloqueio"),
          supabase
            .from("1-chipsInstancias")
            .select("*")
            .eq("statusChip", "liberado")
        ]);

        // Verificar erros em qualquer um dos resultados
        const results = [onlineResult, closedResult, sendingResult, leadsResult, clicksResult, limitsResult, waitingUnlockResult, releasedResult];
        for (const result of results) {
          if (result.error) {
            console.error('Erro na consulta:', result.error);
            throw result.error;
          }
        }

        const totalLeads = leadsResult.data?.reduce((sum, row) => sum + (row.enviosDia || 0), 0) || 0;
        const totalClicks = clicksResult.data?.reduce((sum, row) => sum + (row.cliquesRedirect || 0), 0) || 0;
        const totalSendingLimit = limitsResult.data?.reduce((sum, row) => sum + (row.limiteEnviosDia || 0), 0) || 0;
        const availableSendingLimit = Math.round(totalSendingLimit * 0.35);

        return {
          onlineCount: onlineResult.data?.length || 0,
          closedCount: closedResult.data?.length || 0,
          sendingCount: sendingResult.data?.length || 0,
          waitingUnlockCount: waitingUnlockResult.data?.length || 0,
          releasedCount: releasedResult.data?.length || 0,
          totalLeads,
          totalClicks,
          totalSendingLimit: availableSendingLimit
        };
      } catch (error) {
        console.error('Erro ao buscar instâncias:', error);
        toast.error("Erro ao carregar dados. Por favor, tente novamente.");
        throw error;
      }
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    gcTime: 0
  });

  useEffect(() => {
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

  return { data, isLoading: !data && !error, error };
};