import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ResponsavelSelect } from "./ResponsavelSelect";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface ChipTableRowProps {
  chip: any;
  title: string;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  onCopyChip: (chipNumber: string) => void;
  selectedChips: string[];
  refetchData: () => void;
}

export function ChipTableRow({ 
  chip, 
  title, 
  onCheckboxChange, 
  onCopyChip, 
  selectedChips,
  refetchData 
}: ChipTableRowProps) {
  const { toast } = useToast();

  const handleLiberadoChange = async (chipNumber: string, checked: boolean) => {
    if (!checked) return;
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
    if (!checked) return;
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
    <TableRow>
      <TableCell>
        <Checkbox 
          onCheckedChange={(checked) => {
            if (title.includes("verificarDesconexao")) {
              onCheckboxChange(chip.numeroChip, checked as boolean, true);
            } else {
              handleBanPermanenteChange(chip.numeroChip, checked as boolean);
            }
          }}
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
      <TableCell>
        <ResponsavelSelect
          chipNumber={chip.numeroChip}
          currentValue={chip.responsavelChip || ""}
          onUpdate={refetchData}
        />
      </TableCell>
    </TableRow>
  );
}