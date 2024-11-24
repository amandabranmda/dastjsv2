import { Button } from "@/components/ui/button";
import { Contact2, MessageSquare } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateInstanceForm } from "@/components/CreateInstanceForm";
import { useState } from "react";

interface HeaderSectionProps {
  dialogOpen: boolean;
  showCloseAlert: boolean;
  handleCloseAttempt: () => void;
  setDialogOpen: (open: boolean) => void;
}

export function HeaderSection({ 
  dialogOpen, 
  showCloseAlert, 
  handleCloseAttempt, 
  setDialogOpen 
}: HeaderSectionProps) {
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  return (
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
              onQRGenerationStart={() => setIsGeneratingQR(true)}
              onQRGenerationEnd={() => setIsGeneratingQR(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}