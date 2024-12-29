import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface ResponsibleCellProps {
  chipNumber: string;
  responsavelChip: string | null;
  isEditing: boolean;
  editValue: string;
  onEdit: (chipNumber: string) => void;
  onEditValueChange: (value: string) => void;
  onSave: (chipNumber: string) => void;
}

export function ResponsibleCell({
  chipNumber,
  responsavelChip,
  isEditing,
  editValue,
  onEdit,
  onEditValueChange,
  onSave,
}: ResponsibleCellProps) {
  if (isEditing) {
    return (
      <TableCell>
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSave(chipNumber);
              }
            }}
            onBlur={() => onSave(chipNumber)}
            className="h-8 w-40"
            autoFocus
          />
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <span 
        onClick={() => onEdit(chipNumber)}
        className="cursor-pointer hover:text-blue-500"
      >
        {responsavelChip || '-'}
      </span>
    </TableCell>
  );
}