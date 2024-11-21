import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const useInstances = () => {
  const { data, refetch } = useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      const [onlineResult, closedResult, sendingResult] = await Promise.all([
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
      ]);

      if (onlineResult.error) throw onlineResult.error;
      if (closedResult.error) throw closedResult.error;
      if (sendingResult.error) throw sendingResult.error;

      return {
        onlineCount: onlineResult.data?.length || 0,
        closedCount: closedResult.data?.length || 0,
        sendingCount: sendingResult.data?.length || 0
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
          table: '1-chipsInstancias',
          filter: `statusChip=eq.✅emProducao,statusEnvios=eq.true`
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