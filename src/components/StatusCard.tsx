import { Card } from "@/components/ui/card";
import { Copy, MessageSquare, X, Maximize2, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { ChipStatusDialog } from "./status/ChipStatusDialog";

interface StatusCardProps {
  title: string;
  value: number | string;
  type: "online" | "closed" | "sending" | "production";
}

export function StatusCard({ title, value, type }: StatusCardProps) {
  const { toast } = useToast();
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [checkedChips, setCheckedChips] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const { data: productionChips, refetch: refetchProduction } = useQuery({
    queryKey: ["production-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip")
        .eq("statusChip", "producao externa");

      if (error) throw error;
      return data;
    },
    enabled: type === "production" && title.includes("Produção Externa")
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

  const handleCheckboxChange = async (chipNumber: string, checked: boolean) => {
    const currentTitle = title;
    try {
      let newStatus = "";
      
      if (currentTitle.includes("verificarDesconexao")) {
        newStatus = checked ? "aguardando desbloqueio" : "❌verificarDesconexao";
      } else if (currentTitle.includes("Aguardando Desbloqueio")) {
        newStatus = checked ? "liberado" : "aguardando desbloqueio";
      } else if (currentTitle.includes("Chips Liberados")) {
        newStatus = checked ? "producao externa" : "liberado";
      } else if (currentTitle.includes("Produção Externa")) {
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

  const chips = title.includes("verificarDesconexao") 
    ? disconnectedChips 
    : title.includes("Chips Liberados")
    ? releasedChips
    : title.includes("Produção Externa")
    ? productionChips
    : waitingUnlockChips;

  const refetchData = () => {
    if (title.includes("verificarDesconexao")) {
      refetchDisconnected();
    } else if (title.includes("Aguardando Desbloqueio")) {
      refetchWaiting();
    } else if (title.includes("Chips Liberados")) {
      refetchReleased();
    } else if (title.includes("Produção Externa")) {
      refetchProduction();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                type === "sending" && "bg-[#9333EA]",
                type === "production" && "bg-[#10B981]"
              )} />
              <h3 className="text-xs sm:text-sm text-gray-400 font-medium">{title}</h3>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">{value}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {(type === "closed" || type === "production") && (
        <ChipStatusDialog
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