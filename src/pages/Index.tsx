import { useInstances } from "@/hooks/useInstances";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HeaderSection } from "@/components/dashboard/HeaderSection";
import { StatusSection } from "@/components/dashboard/StatusSection";
import { MetricsSection } from "@/components/dashboard/MetricsSection";
import { ChipsSection } from "@/components/dashboard/ChipsSection";
import { ChipsTableSection } from "@/components/dashboard/ChipsTableSection";

const Index = () => {
  const { data: instancesData, isLoading } = useInstances();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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

  const calculateOptinRate = () => {
    if (!instancesData?.totalClicks || !instancesData?.totalLeads) return "0";
    const rate = (instancesData.totalLeads / instancesData.totalClicks) * 100;
    return rate.toFixed(2);
  };

  const calculateRemainingMessages = () => {
    if (!instancesData?.totalSendingLimit || !instancesData?.totalLeads) return "0";
    const remaining = instancesData.totalSendingLimit - instancesData.totalLeads;
    return `Você ainda tem ${remaining} envios disponíveis`;
  };

  const handleCloseAttempt = () => {
    if (isGeneratingQR) {
      setShowCloseAlert(true);
    } else {
      setDialogOpen(false);
    }
  };

  const handleStatusCardClick = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <HeaderSection 
          dialogOpen={dialogOpen}
          showCloseAlert={showCloseAlert}
          isGeneratingQR={isGeneratingQR}
          handleCloseAttempt={handleCloseAttempt}
          setDialogOpen={setDialogOpen}
          setIsGeneratingQR={setIsGeneratingQR}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatusSection 
            instancesData={instancesData}
            isLoading={isLoading}
            onStatusCardClick={handleStatusCardClick}
          />
          {selectedStatus === "❌verificarDesconexao" && (
            <div className="lg:col-span-3">
              <ChipsTableSection 
                selectedStatus={selectedStatus}
                statusChips={statusChips}
                onClose={() => setSelectedStatus(null)}
              />
            </div>
          )}
        </div>

        <MetricsSection 
          instancesData={instancesData}
          isLoading={isLoading}
          calculateOptinRate={calculateOptinRate}
          calculateRemainingMessages={calculateRemainingMessages}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <ChipsSection 
            instancesData={instancesData}
            isLoading={isLoading}
            onStatusCardClick={handleStatusCardClick}
          />
          {(selectedStatus === "aguardando desbloqueio" || selectedStatus === "liberado") && (
            <div className="lg:col-span-3">
              <ChipsTableSection 
                selectedStatus={selectedStatus}
                statusChips={statusChips}
                onClose={() => setSelectedStatus(null)}
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente fechar?</AlertDialogTitle>
            <AlertDialogDescription>
              {isGeneratingQR 
                ? "Você está gerando um QR Code. Se fechar agora, perderá o progresso."
                : "A verificação do status da instância está em andamento. Se fechar agora, não poderá ver o resultado."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCloseAlert(false);
                setDialogOpen(false);
                setIsGeneratingQR(false);
              }}
            >
              Sim, fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;