import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useInstances = () => {
  return useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      // Fetch online instances
      const { data: onlineData } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "online");

      // Fetch sending instances
      const { data: sendingData } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "enviando");

      // Fetch closed instances
      const { data: closedData } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "❌verificarDesconexao");

      // Fetch waiting unlock instances
      const { data: waitingUnlockData } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "aguardando desbloqueio");

      // Fetch released instances
      const { data: releasedData } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "liberado");

      // Fetch production instances
      const { data: productionData } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", "producao");

      // Get sending limit
      const { data: limitsData } = await supabase
        .from("1-chipsInstancias")
        .select("limiteEnviosDia")
        .not("limiteEnviosDia", "is", null);

      // Get total leads
      const { data: leadsData } = await supabase
        .from("1-chipsInstancias")
        .select("enviosDia")
        .not("enviosDia", "is", null);

      // Get total clicks
      const { data: clicksData } = await supabase
        .from("1-chipsInstancias")
        .select("cliquesRedirect")
        .not("cliquesRedirect", "is", null);

      const totalSendingLimit = limitsData?.reduce((acc, curr) => acc + (curr.limiteEnviosDia || 0), 0) || 0;
      const totalLeads = leadsData?.reduce((acc, curr) => acc + (curr.enviosDia || 0), 0) || 0;
      const totalClicks = clicksData?.reduce((acc, curr) => acc + (curr.cliquesRedirect || 0), 0) || 0;

      return {
        onlineCount: onlineData?.length || 0,
        sendingCount: sendingData?.length || 0,
        closedCount: closedData?.length || 0,
        waitingUnlockCount: waitingUnlockData?.length || 0,
        releasedCount: releasedData?.length || 0,
        productionCount: productionData?.length || 0,
        totalSendingLimit,
        totalLeads,
        totalClicks,
      };
    },
  });
};