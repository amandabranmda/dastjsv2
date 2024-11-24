import { useInstances } from "@/hooks/useInstances";
import { useState } from "react";
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
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { data: instancesData, isLoading } = useInstances();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <HeaderSection 
          dialogOpen={dialogOpen}
          showCloseAlert={showCloseAlert}
          handleCloseAttempt={() => {
            setShowCloseAlert(true);
          }}
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
              onStatusCardClick={setSelectedStatus}
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
          onStatusCardClick={setSelectedStatus}
        />
        
        {(selectedStatus === "aguardando desbloqueio" || selectedStatus === "liberado") && (
          <ChipsTableSection 
            selectedStatus={selectedStatus}
            statusChips={statusChips}
            onClose={() => setSelectedStatus(null)}
          />
        )}
      </div>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente fechar?</AlertDialogTitle>
            <AlertDialogDescription>
              A verificação do status da instância está em andamento. Se fechar agora, não poderá ver o resultado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCloseAlert(false);
                setDialogOpen(false);
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