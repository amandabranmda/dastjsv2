import { useState } from "react";
import { HeaderSection } from "@/components/dashboard/HeaderSection";
import { StatusSection } from "@/components/dashboard/StatusSection";
import { MetricsSection } from "@/components/dashboard/MetricsSection";
import { ChipsSection } from "@/components/dashboard/ChipsSection";
import { ChipsTableSection } from "@/components/dashboard/ChipsTableSection";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: instancesData, isLoading } = useQuery({
    queryKey: ["instances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("*");

      if (error) throw error;

      const onlineCount = data.filter((instance) => instance.status === "online").length;
      const closedCount = data.filter((instance) => instance.status === "closed").length;
      const sendingCount = data.filter((instance) => instance.status === "sending").length;
      const waitingUnlockCount = data.filter((instance) => instance.statusChip === "aguardando desbloqueio").length;
      const releasedCount = data.filter((instance) => instance.statusChip === "liberado").length;
      const totalLeads = data.reduce((acc, curr) => acc + (curr.totalLeads || 0), 0);
      const totalClicks = data.reduce((acc, curr) => acc + (curr.totalClicks || 0), 0);
      const totalSendingLimit = data.reduce((acc, curr) => acc + (curr.sendingLimit || 0), 0);

      return {
        onlineCount,
        closedCount,
        sendingCount,
        waitingUnlockCount,
        releasedCount,
        totalLeads,
        totalClicks,
        totalSendingLimit,
      };
    },
  });

  const handleCloseAttempt = () => {
    setShowCloseAlert(true);
  };

  const handleStatusCardClick = (status: string) => {
    setSelectedStatus(status);
  };

  const { data: statusChips } = useQuery({
    queryKey: ["status-chips", selectedStatus],
    enabled: !!selectedStatus,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("*")
        .eq("statusChip", selectedStatus);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <HeaderSection 
          dialogOpen={dialogOpen}
          showCloseAlert={showCloseAlert}
          handleCloseAttempt={handleCloseAttempt}
          setDialogOpen={setDialogOpen}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {selectedStatus === "❌verificarDesconexao" ? (
            <Card className="metric-card">
              <ChipsTableSection 
                selectedStatus={selectedStatus}
                statusChips={statusChips}
                onClose={() => setSelectedStatus(null)}
              />
            </Card>
          ) : (
            <StatusSection 
              instancesData={instancesData}
              isLoading={isLoading}
              onStatusCardClick={handleStatusCardClick}
            />
          )}
        </div>

        <MetricsSection 
          instancesData={instancesData}
          isLoading={isLoading}
        />

        <ChipsSection 
          instancesData={instancesData}
          isLoading={isLoading}
          onStatusCardClick={handleStatusCardClick}
        />
        
        {(selectedStatus === "aguardando desbloqueio" || selectedStatus === "liberado") && (
          <ChipsTableSection 
            selectedStatus={selectedStatus}
            statusChips={statusChips}
            onClose={() => setSelectedStatus(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;