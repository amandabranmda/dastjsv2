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
    <TableRow className="hover:bg-sky-950/30 transition-colors">
      <TableCell>
        <Checkbox 
          className="border-sky-600/50"
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
          className="border-sky-600/50"
          onCheckedChange={(checked) => onLiberadoChange(chip.numeroChip, checked as boolean)}
        />
      </TableCell>
      <TableCell 
        onClick={() => onCopyChip(chip.numeroChip)}
        className={cn(
          "cursor-pointer hover:text-sky-400 transition-colors font-medium",
          selectedChips.includes(chip.numeroChip) ? "text-sky-400" : ""
        )}
      >
        {chip.numeroChip}
      </TableCell>
      <TableCell className="font-medium">{chip.localChip || '-'}</TableCell>
      {title.includes("Chips Liberados") && (
        <ResponsibleCell
          chipNumber={chip.numeroChip}
          responsavelChip={chip.responsavelChip}
          isEditing={isEditing}
          editValue={editValue}
          onEdit={onEdit}
          onEditValueChange={onEditValueChange}
          onSave={onSave}
        />
      )}
    </TableRow>
  );
}