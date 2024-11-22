import { Button } from "@/components/ui/button";
import { Contact2, MessageSquare } from "lucide-react";
import { StatusCard } from "@/components/StatusCard";
import { MetricCard } from "@/components/MetricCard";
import { useInstances } from "@/hooks/useInstances";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateInstanceForm } from "@/components/CreateInstanceForm";
import { useState } from "react";
import { ChipRegistrationForm } from "@/components/ChipRegistrationForm";
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

const Index = () => {
  const { data: instancesData, isLoading } = useInstances();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

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
    if (isGeneratingQR || isCheckingStatus) {
      setShowCloseAlert(true);
    } else {
      setDialogOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2D3748] p-4 sm:p-6 md:p-8 space-y-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Zaps Dashboard
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="secondary" className="gap-2 text-sm sm:text-base flex-1 sm:flex-none bg-[#9b87f5] hover:bg-[#8b77e5] transition-colors">
              <Contact2 className="w-4 h-4" />
              Contatos
            </Button>
            <Dialog open={dialogOpen} onOpenChange={handleCloseAttempt}>
              <Button variant="default" onClick={() => setDialogOpen(true)} className="gap-2 text-sm sm:text-base flex-1 sm:flex-none bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity">
                <MessageSquare className="w-4 h-4" />
                Criar Instância
              </Button>
              <DialogContent>
                <CreateInstanceForm 
                  onClose={() => setDialogOpen(false)} 
                  onQRGenerationStart={() => {
                    setIsGeneratingQR(true);
                    setIsCheckingStatus(true);
                  }}
                  onQRGenerationEnd={() => setIsGeneratingQR(false)}
                  onStatusCheckComplete={() => setIsCheckingStatus(false)}
                />
              </DialogContent>
            </Dialog>
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
                  setIsCheckingStatus(false);
                }}
              >
                Sim, fechar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="animate-fade-in [animation-delay:400ms]">
            <StatusCard 
              title="Instâncias Enviando" 
              value={isLoading ? "..." : instancesData?.sendingCount || 0} 
              type="sending" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:600ms]">
            <StatusCard 
              title="Instâncias Online" 
              value={isLoading ? "..." : instancesData?.onlineCount || 0} 
              type="online" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:800ms]">
            <StatusCard 
              title="❌verificarDesconexao" 
              value={isLoading ? "..." : instancesData?.closedCount || 0} 
              type="closed" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="animate-fade-in [animation-delay:800ms]">
            <MetricCard
              title="Cliques"
              value={isLoading ? "..." : instancesData?.totalClicks || 0}
              change="+45"
              type="preset"
            />
          </div>
          <div className="animate-fade-in [animation-delay:1000ms]">
            <MetricCard
              title="Leads"
              value={isLoading ? "..." : instancesData?.totalLeads || 0}
              change={`${calculateOptinRate()}% optin`}
              type="optin"
            />
          </div>
          <div className="animate-fade-in [animation-delay:1200ms]">
            <MetricCard
              title="Limite de envios"
              value={isLoading ? "..." : instancesData?.totalSendingLimit || 0}
              change={calculateRemainingMessages()}
              type="sales"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          <div className="animate-fade-in [animation-delay:1400ms]">
            <StatusCard 
              title="Aguardando Desbloqueio" 
              value={isLoading ? "..." : instancesData?.waitingUnlockCount || 0}
              type="closed" 
            />
          </div>
          <div className="animate-fade-in [animation-delay:1600ms]">
            <StatusCard 
              title="Chips Liberados" 
              value={isLoading ? "..." : instancesData?.releasedCount || 0}
              type="closed" 
            />
          </div>
        </div>

        <div className="mt-6">
          <ChipRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default Index;