import { StatusCard } from "@/components/StatusCard";
import { useInstances } from "@/hooks/useInstances";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateInstanceForm } from "@/components/CreateInstanceForm";
import { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { ChipRegistrationForm } from "@/components/ChipRegistrationForm";

const Instances = () => {
  const { data: instancesData, isLoading } = useInstances();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const calculateIdleInstances = () => {
    if (!instancesData?.onlineCount || !instancesData?.sendingCount) return "0";
    const idle = instancesData.onlineCount - instancesData.sendingCount;
    return idle;
  };

  return (
    <div className="space-y-4 sm:space-y-8 max-w-[1400px] mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20 p-4 sm:p-6 rounded-lg backdrop-blur-sm border border-sky-600/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Gerenciamento de Instâncias
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Gerencie todas as suas instâncias em um só lugar
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button 
            variant="default" 
            onClick={() => setDialogOpen(true)} 
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nova Instância
          </Button>
          <DialogContent className="w-[95vw] sm:w-auto max-w-2xl">
            <CreateInstanceForm 
              onClose={() => setDialogOpen(false)} 
              onQRGenerationStart={() => setIsGeneratingQR(true)}
              onQRGenerationEnd={() => setIsGeneratingQR(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="animate-fade-in [animation-delay:400ms] hover:scale-[1.02] transition-transform duration-200">
          <StatusCard 
            title="Instâncias Online" 
            value={isLoading ? "..." : instancesData?.onlineCount || 0} 
            type="online" 
          />
        </div>
        <div className="animate-fade-in [animation-delay:600ms] hover:scale-[1.02] transition-transform duration-200">
          <StatusCard 
            title="Instâncias Enviando" 
            value={isLoading ? "..." : instancesData?.sendingCount || 0} 
            type="sending" 
          />
        </div>
        <div className="animate-fade-in [animation-delay:800ms] hover:scale-[1.02] transition-transform duration-200">
          <StatusCard
            title="Instâncias Aguardando"
            value={isLoading ? "..." : calculateIdleInstances()}
            type="online"
          />
        </div>
        <div className="animate-fade-in [animation-delay:1000ms] hover:scale-[1.02] transition-transform duration-200">
          <StatusCard 
            title="❌verificarDesconexao" 
            value={isLoading ? "..." : instancesData?.closedCount || 0} 
            type="closed" 
          />
        </div>
        <div className="animate-fade-in [animation-delay:1200ms] hover:scale-[1.02] transition-transform duration-200">
          <StatusCard 
            title="Aguardando Desbloqueio" 
            value={isLoading ? "..." : instancesData?.waitingUnlockCount || 0}
            type="closed" 
          />
        </div>
        <div className="animate-fade-in [animation-delay:1400ms] hover:scale-[1.02] transition-transform duration-200">
          <StatusCard 
            title="Chips Liberados" 
            value={isLoading ? "..." : instancesData?.releasedCount || 0}
            type="closed" 
          />
        </div>
      </div>

      <div className="animate-fade-in [animation-delay:1600ms]">
        <ChipRegistrationForm />
      </div>
    </div>
  );
};

export default Instances;