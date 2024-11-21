import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface StatusCardProps {
  title: string;
  value: number | string;
  type: "online" | "closed" | "sending";
}

export function StatusCard({ title, value, type }: StatusCardProps) {
  const { toast } = useToast();
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  
  const { data: chips } = useQuery({
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="glass-card p-6 animate-fade-in-scale cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                type === "online" && "bg-primary",
                type === "closed" && "bg-destructive",
                type === "sending" && "bg-secondary"
              )} />
              <h3 className="text-sm text-gray-400">{title}</h3>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-4xl font-semibold tracking-tight">{value}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {type === "closed" && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chips Desconectados</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Selecionar</TableHead>
                  <TableHead>Número do Chip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chips?.map((chip) => (
                  <TableRow key={chip.numeroChip}>
                    <TableCell>
                      <Checkbox />
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