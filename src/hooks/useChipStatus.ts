import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useChipStatus(title: string) {
  const { data: disconnectedChips, refetch: refetchDisconnected } = useQuery({
    queryKey: ["disconnected-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip")
        .eq("statusChip", "❌verificarDesconexao");

      if (error) throw error;
      return data;
    },
    enabled: title.includes("verificarDesconexao")
  });

  const { data: waitingUnlockChips, refetch: refetchWaiting } = useQuery({
    queryKey: ["waiting-unlock-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip")
        .eq("statusChip", "aguardando desbloqueio");

      if (error) throw error;
      return data;
    },
    enabled: title.includes("Aguardando Desbloqueio")
  });

  const { data: releasedChips, refetch: refetchReleased } = useQuery({
    queryKey: ["released-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip,responsavelChip")
        .eq("statusChip", "liberado");

      if (error) throw error;
      return data;
    },
    enabled: title.includes("Chips Liberados")
  });

  const refetchData = () => {
    if (title.includes("verificarDesconexao")) {
      refetchDisconnected();
    } else if (title.includes("Aguardando Desbloqueio")) {
      refetchWaiting();
    } else if (title.includes("Chips Liberados")) {
      refetchReleased();
    }
  };

  return {
    chips: title.includes("verificarDesconexao") 
      ? disconnectedChips 
      : title.includes("Chips Liberados")
      ? releasedChips
      : waitingUnlockChips,
    refetchData
  };
}