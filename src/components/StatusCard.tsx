import { Card } from "@/components/ui/card";
import { Copy, MessageSquare, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ChipsTable } from "./ChipsTable";

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

  const { data: disconnectedChips, refetch: refetchDisconnected } = useQuery({
    queryKey: ["disconnected-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip")
        .eq("statusChip", "❌verificarDesconexao");

      if (error) throw error;
      return data;
    },
    enabled: type === "closed" && title.includes("verificarDesconexao")
  });

  const { data: waitingUnlockChips, refetch: refetchWaiting } = useQuery({
    queryKey: ["waiting-unlock-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip")
        .eq("statusChip", "aguardando desbloqueio");

      if (error) throw error;
      return data;
    },
    enabled: type === "closed" && title.includes("Aguardando Desbloqueio")
  });

  const { data: releasedChips, refetch: refetchReleased } = useQuery({
    queryKey: ["released-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip")
        .eq("statusChip", "liberado");

      if (error) throw error;
      return data;
    },
    enabled: type === "closed" && title.includes("Chips Liberados")
  });

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

  const handleCheckboxChange = async (chipNumber: string, checked: boolean, isDisconnected: boolean) => {
    if (title.includes("Chips Liberados")) {
      if (checked) {
        setCheckedChips(prev => [...prev, chipNumber]);
      } else {
        setCheckedChips(prev => prev.filter(chip => chip !== chipNumber));
      }
      return;
    }

    try {
      const newStatus = checked ? 
        (isDisconnected ? "aguardando desbloqueio" : "liberado") : 
        (isDisconnected ? "❌verificarDesconexao" : "aguardando desbloqueio");
      
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ statusChip: newStatus })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Status do chip ${chipNumber} atualizado com sucesso!`,
        duration: 2000,
      });

      if (isDisconnected) {
        refetchDisconnected();
      } else {
        refetchWaiting();
      }
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

  const chips = title.includes("verificarDesconexao") 
    ? disconnectedChips 
    : title.includes("Chips Liberados")
    ? releasedChips
    : waitingUnlockChips;
    
  const dialogTitle = title.includes("verificarDesconexao") 
    ? "Chips Desconectados" 
    : title.includes("Chips Liberados")
    ? "Chips Liberados"
    : "Chips Aguardando Desbloqueio";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-[#111827]/70 backdrop-blur-sm border border-white/5 p-4 sm:p-6 animate-fade-in-scale cursor-pointer hover:bg-[#1F2937]/50 transition-colors relative min-h-[120px] sm:min-h-[140px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullScreen();
            }}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200/10 rounded-full transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                type === "online" && "bg-[#10B981]",
                type === "closed" && title.includes("Aguardando Desbloqueio") ? "bg-[#F97316]" : "bg-[#0EA5E9]",
                type === "sending" && "bg-[#9333EA]"
              )} />
              <h3 className="text-xs sm:text-sm text-gray-400 font-medium">{title}</h3>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">{value}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {type === "closed" && (
        <DialogContent className={cn(
          "w-[95vw] sm:max-w-[600px]",
          "max-h-[90vh] sm:max-h-[80vh]",
          isFullScreen && "!w-[95vw] !h-[95vh]"
        )}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Lista de chips com status {dialogTitle.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className={cn(
            "overflow-y-auto",
            isFullScreen ? "max-h-[80vh]" : "max-h-[60vh] sm:max-h-[400px]"
          )}>
            <ChipsTable
              chips={chips || []}
              title={title}
              onCheckboxChange={handleCheckboxChange}
              onCopyChip={handleCopyChip}
              selectedChips={selectedChips}
              checkedChips={checkedChips}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}