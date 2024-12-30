import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Input } from "../ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChipResponsibleProps {
  responsavelChip: string;
  numeroChip: string;
  onUpdate: () => void;
}

export function ChipResponsible({ responsavelChip, numeroChip, onUpdate }: ChipResponsibleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(responsavelChip);

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleSave = async () => {
    try {
      const capitalizedValue = capitalizeFirstLetter(editValue);
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: capitalizedValue })
        .eq("numeroChip", numeroChip);

      if (error) throw error;

      toast.success("Responsável atualizado com sucesso!");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error);
      toast.error("Erro ao atualizar responsável");
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
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
      onClick={() => setIsEditing(true)}
    >
      <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
        {responsavelChip ? capitalizeFirstLetter(responsavelChip) : '-'}
      </p>
      <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
    </div>
  );
}