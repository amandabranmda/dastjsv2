import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const useInstances = () => {
  const { data, refetch } = useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "✅emProducao")
        .eq("statusInstancia", "open");

      if (error) throw error;

      return {
        onlineCount: data?.length || 0
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
          filter: `statusChip=eq.✅emProducao`
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