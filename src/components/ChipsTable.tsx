import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

interface ChipsTableProps {
  chips: any[];
  title: string;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  onCopyChip: (chipNumber: string) => void;
  selectedChips: string[];
  checkedChips: string[];
  refetchData: () => void;
}

export function ChipsTable({ 
  chips, 
  title, 
  onCheckboxChange, 
  onCopyChip, 
  selectedChips, 
  checkedChips,
  refetchData 
}: ChipsTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const sortedChips = [...chips].sort((a, b) => {
    const locationA = (a.localChip || '').toLowerCase();
    const locationB = (b.localChip || '').toLowerCase();
    
    if (sortOrder === 'asc') {
      return locationA.localeCompare(locationB);
    } else {
      return locationB.localeCompare(locationA);
    }
  });

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  const handleLiberadoChange = async (chipNumber: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ statusChip: "liberado" })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Chip ${chipNumber} liberado com sucesso!`,
        duration: 2000,
      });

      // Refetch data after successful update
      refetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar status do chip",
        duration: 2000,
      });
    }
  };

  const handleBanPermanenteChange = async (chipNumber: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ statusChip: "bam permanente" })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Chip ${chipNumber} banido permanentemente!`,
        duration: 2000,
      });

      // Refetch data after successful update
      refetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar status do chip",
        duration: 2000,
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            {title.includes("verificarDesconexao") ? "Pedido Desbloqueio" : "Ban Permanente"}
          </TableHead>
          <TableHead className="w-[50px]">Liberado</TableHead>
          <TableHead>Número do Chip</TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={toggleSort}
              className="hover:bg-transparent p-0 h-auto font-medium text-muted-foreground flex items-center gap-1"
            >
              Local do Chip
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedChips?.map((chip) => (
          <TableRow key={chip.numeroChip}>
            <TableCell>
              <Checkbox 
                checked={title.includes("Chips Liberados") ? checkedChips.includes(chip.numeroChip) : undefined}
                onCheckedChange={(checked) => 
                  onCheckboxChange(
                    chip.numeroChip, 
                    checked as boolean, 
                    title.includes("verificarDesconexao")
                  )
                }
              />
            </TableCell>
            <TableCell>
              <Checkbox 
                onCheckedChange={(checked) => handleLiberadoChange(chip.numeroChip, checked as boolean)}
              />
            </TableCell>
            <TableCell 
              onClick={() => onCopyChip(chip.numeroChip)}
              className={cn(
                "cursor-pointer hover:text-[#FFD700] transition-colors",
                selectedChips.includes(chip.numeroChip) ? "text-[#FFD700]" : ""
              )}
            >
              {chip.numeroChip}
            </TableCell>
            <TableCell>{chip.localChip || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}