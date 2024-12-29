import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { StatusCardHeader } from "./status/StatusCardHeader";
import { StatusCardDialog } from "./status/StatusCardDialog";
import { useChipStatus } from "@/hooks/useChipStatus";
import { supabase } from "@/lib/supabase";

interface StatusCardProps {
  title: string;
  value: number | string;
  type: "online" | "closed" | "sending";
}

export function StatusCard({ title, value, type }: StatusCardProps) {
  const { toast } = useToast();
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [checkedChips, setCheckedChips] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { responsavelChip, chips, refetchData } = useChipStatus(title);

  const handleCopyChip = async (chipNumber: string) => {
    try {
      await navigator.clipboard.writeText(chipNumber);
      if (!selectedChips.includes(chipNumber)) {
        setSelectedChips([...selectedChips, chipNumber]);
      }
      toast({
        description: "Número do chip copiado com sucesso!",
        duration: 2000,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao copiar número do chip",
        duration: 2000,
      });
    }
  };

  const handleCheckboxChange = async (chipNumber: string, checked: boolean) => {
    const currentTitle = title;
    try {
      let newStatus = "";
      
      if (currentTitle.includes("verificarDesconexao")) {
        newStatus = checked ? "aguardando desbloqueio" : "❌verificarDesconexao";
      } else if (currentTitle.includes("Aguardando Desbloqueio")) {
        newStatus = checked ? "liberado" : "aguardando desbloqueio";
      } else if (currentTitle.includes("Chips Liberados")) {
        if (checked) {
          setCheckedChips(prev => [...prev, chipNumber]);
        } else {
          setCheckedChips(prev => prev.filter(chip => chip !== chipNumber));
        }
        return;
      }
      
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ statusChip: newStatus })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Status do chip ${chipNumber} atualizado com sucesso!`,
        duration: 2000,
      });

      refetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar status do chip",
        duration: 2000,
      });
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Add handler for dialog open state change
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      // Refetch data when dialog opens
      refetchData();
      console.log("Refetching data on dialog open");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Card className="bg-[#111827]/70 backdrop-blur-sm border border-white/5 p-4 sm:p-6 animate-fade-in-scale cursor-pointer hover:bg-[#1F2937]/50 transition-colors relative min-h-[120px] sm:min-h-[140px]">
          <StatusCardHeader
            title={title}
            value={value}
            type={type}
            onFullScreenClick={(e) => {
              e.stopPropagation();
              toggleFullScreen();
            }}
          />
        </Card>
      </DialogTrigger>

      {type === "closed" && (
        <StatusCardDialog
          isOpen={dialogOpen}
          title={title}
          chips={chips || []}
          selectedChips={selectedChips}
          checkedChips={checkedChips}
          onCopyChip={handleCopyChip}
          onCheckboxChange={handleCheckboxChange}
          refetchData={refetchData}
          isFullScreen={isFullScreen}
        />
      )}
    </Dialog>
  );
}