import { StatusCard } from "@/components/StatusCard";
import { useInstances } from "@/hooks/useInstances";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateInstanceForm } from "@/components/CreateInstanceForm";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ChipRegistrationForm } from "@/components/ChipRegistrationForm";

const Instances = () => {
  const { data: instancesData, isLoading } = useInstances();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciamento de Instâncias</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button 
            variant="default" 
            onClick={() => setDialogOpen(true)} 
            className="gap-2 bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="w-4 h-4" />
            Criar Instância
          </Button>
          <DialogContent>
            <CreateInstanceForm 
              onClose={() => setDialogOpen(false)} 
              onQRGenerationStart={() => setIsGeneratingQR(true)}
              onQRGenerationEnd={() => setIsGeneratingQR(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="animate-fade-in [animation-delay:1800ms]">
          <ChipRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default Instances;