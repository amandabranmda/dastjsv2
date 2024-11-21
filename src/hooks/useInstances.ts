import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useInstances = () => {
  return useQuery({
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
};