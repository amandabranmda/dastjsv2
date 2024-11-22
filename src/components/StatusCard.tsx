import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Maximize2 } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: number | string;
  type: "online" | "closed" | "sending";
}

export function StatusCard({ title, value, type }: StatusCardProps) {
  const { toast } = useToast();
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const { data: chips, refetch } = useQuery({
    queryKey: ["disconnected-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip")
        .eq("statusChip", "❌verificarDesconexao");

      if (error) throw error;
      return data;
    },
    enabled: type === "closed"
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
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ statusChip: checked ? "aguardando desbloqueio" : "❌verificarDesconexao" })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Status do chip ${chipNumber} atualizado com sucesso!`,
        duration: 2000,
      });

      refetch();
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-[#111827]/70 backdrop-blur-sm border border-white/5 p-6 animate-fade-in-scale cursor-pointer hover:bg-[#1F2937]/50 transition-colors relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullScreen();
            }}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200/10 rounded-full transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </button>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                type === "online" && "bg-[#10B981]",
                type === "closed" && "bg-destructive",
                type === "sending" && "bg-[#9333EA]"
              )} />
              <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-4xl font-semibold tracking-tight text-white">{value}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {type === "closed" && (
        <DialogContent className={cn("sm:max-w-[600px]", isFullScreen && "!max-w-[95vw] !h-[95vh]")}>
          <DialogHeader>
            <DialogTitle>Chips Desconectados</DialogTitle>
          </DialogHeader>
          <div className={cn("overflow-y-auto", isFullScreen ? "max-h-[80vh]" : "max-h-[400px]")}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Pedido Desbloqueio</TableHead>
                  <TableHead>Número do Chip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chips?.map((chip) => (
                  <TableRow key={chip.numeroChip}>
                    <TableCell>
                      <Checkbox 
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(chip.numeroChip, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell 
                      onClick={() => handleCopyChip(chip.numeroChip)}
                      className={cn(
                        "cursor-pointer hover:text-[#FFD700] transition-colors",
                        selectedChips.includes(chip.numeroChip) ? "text-[#FFD700]" : ""
                      )}
                    >
                      {chip.numeroChip}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}