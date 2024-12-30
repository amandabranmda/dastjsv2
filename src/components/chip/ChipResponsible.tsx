import { Edit2 } from "lucide-react";
import { Input } from "../ui/input";

interface ChipResponsibleProps {
  responsavelChip: string;
  isEditing: boolean;
  editValue: string;
  onEdit: () => void;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
  capitalizeFirstLetter: (str: string) => string;
}

export function ChipResponsible({
  responsavelChip,
  isEditing,
  editValue,
  onEdit,
  onEditValueChange,
  onSave,
  capitalizeFirstLetter
}: ChipResponsibleProps) {
  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => onEditValueChange(e.target.value)}
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSave();
          }
        }}
        className="bg-black/20 border-sky-600/20 text-white"
        autoFocus
      />
    );
  }

  return (
    <div 
      className="flex items-center gap-2 group cursor-pointer"
      onClick={onEdit}
    >
      <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
        {responsavelChip ? capitalizeFirstLetter(responsavelChip) : '-'}
      </p>
      <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
    </div>
  );
}