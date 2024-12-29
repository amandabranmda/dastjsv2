import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { ChipsTableHeader } from "./table/TableHeader";
import { ChipRow } from "./table/ChipRow";

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
  refetchData 
}: ChipsTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const [editingChip, setEditingChip] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const sortedChips = [...chips].sort((a, b) => {
    const locationA = (a.localChip || '').toLowerCase();
    const locationB = (b.localChip || '').toLowerCase();
    return sortOrder === 'asc' 
      ? locationA.localeCompare(locationB)
      : locationB.localeCompare(locationA);
  });

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

  const handleResponsavelEdit = async (chipNumber: string) => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: editValue })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: "Responsável atualizado com sucesso!",
        duration: 2000,
      });

      setEditingChip(null);
      refetchData();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar responsável",
        duration: 2000,
      });
    }
  };

  return (
    <Table>
      <ChipsTableHeader 
        title={title} 
        onSort={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')} 
      />
      <TableBody>
        {sortedChips?.map((chip) => (
          <ChipRow
            key={chip.numeroChip}
            chip={chip}
            title={title}
            onCheckboxChange={onCheckboxChange}
            onLiberadoChange={handleLiberadoChange}
            onCopyChip={onCopyChip}
            selectedChips={selectedChips}
            isEditing={editingChip === chip.numeroChip}
            editValue={editValue}
            onEdit={(chipNumber) => {
              setEditingChip(chipNumber);
              setEditValue(chip.responsavelChip || '');
            }}
            onEditValueChange={setEditValue}
            onSave={handleResponsavelEdit}
          />
        ))}
      </TableBody>
    </Table>
  );
}