import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ResponsibleCell } from "./ResponsibleCell";

interface ChipRowProps {
  chip: any;
  title: string;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  onLiberadoChange: (chipNumber: string, checked: boolean) => void;
  onCopyChip: (chipNumber: string) => void;
  selectedChips: string[];
  isEditing: boolean;
  editValue: string;
  onEdit: (chipNumber: string) => void;
  onEditValueChange: (value: string) => void;
  onSave: (chipNumber: string) => void;
}

export function ChipRow({
  chip,
  title,
  onCheckboxChange,
  onLiberadoChange,
  onCopyChip,
  selectedChips,
  isEditing,
  editValue,
  onEdit,
  onEditValueChange,
  onSave,
}: ChipRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          onCheckedChange={(checked) => {
            if (title.includes("verificarDesconexao")) {
              onCheckboxChange(chip.numeroChip, checked as boolean, true);
            } else {
              onCheckboxChange(chip.numeroChip, checked as boolean, false);
            }
          }}
        />
      </TableCell>
      <TableCell>
        <Checkbox 
          onCheckedChange={(checked) => onLiberadoChange(chip.numeroChip, checked as boolean)}
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
      {title.includes("Chips Liberados") && (
        <ResponsibleCell
          chipNumber={chip.numeroChip}
          responsavelChip={chip.responsavelChip}
          isEditing={isEditing && chip.numeroChip === chip.numeroChip}
          editValue={editValue}
          onEdit={onEdit}
          onEditValueChange={onEditValueChange}
          onSave={onSave}
        />
      )}
    </TableRow>
  );
}