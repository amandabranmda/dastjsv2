import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useInstances() {
  return useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      const [
        { count: onlineCount },
        { count: closedCount },
        { count: sendingCount },
        { count: waitingUnlockCount },
        { count: releasedCount },
        { count: productionCount },
        { data: totalClicksData },
        { data: totalLeadsData },
        { data: totalSendingLimitData }
      ] = await Promise.all([
        supabase
          .from("1-chipsInstancias")
          .select("*", { count: "exact", head: true })
          .eq("statusChip", "online"),
        supabase
          .from("1-chipsInstancias")
          .select("*", { count: "exact", head: true })
          .eq("statusChip", "❌verificarDesconexao"),
        supabase
          .from("1-chipsInstancias")
          .select("*", { count: "exact", head: true })
          .eq("statusChip", "enviando"),
        supabase
          .from("1-chipsInstancias")
          .select("*", { count: "exact", head: true })
          .eq("statusChip", "aguardando desbloqueio"),
        supabase
          .from("1-chipsInstancias")
          .select("*", { count: "exact", head: true })
          .eq("statusChip", "liberado"),
        supabase
          .from("1-chipsInstancias")
          .select("*", { count: "exact", head: true })
          .eq("statusChip", "producao externa"),
        supabase
          .from("1-chipsInstancias")
          .select("totalClicks")
          .not("totalClicks", "is", null),
        supabase
          .from("1-chipsInstancias")
          .select("totalLeads")
          .not("totalLeads", "is", null),
        supabase
          .from("1-chipsInstancias")
          .select("sendingLimit")
          .not("sendingLimit", "is", null)
      ]);

      const totalClicks = totalClicksData?.reduce((sum, item) => sum + (item.totalClicks || 0), 0) || 0;
      const totalLeads = totalLeadsData?.reduce((sum, item) => sum + (item.totalLeads || 0), 0) || 0;
      const totalSendingLimit = totalSendingLimitData?.reduce((sum, item) => sum + (item.sendingLimit || 0), 0) || 0;

      return {
        onlineCount: onlineCount || 0,
        closedCount: closedCount || 0,
        sendingCount: sendingCount || 0,
        waitingUnlockCount: waitingUnlockCount || 0,
        releasedCount: releasedCount || 0,
        productionCount: productionCount || 0,
        totalClicks,
        totalLeads,
        totalSendingLimit
      };
    }
  });
}