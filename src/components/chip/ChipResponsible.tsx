import { useState } from "react";
import { Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { USER_OPTIONS } from "@/constants/userOptions";

interface ChipResponsibleProps {
  responsavelChip: string;
  numeroChip: string;
  onUpdate: () => void;
}

export function ChipResponsible({ responsavelChip, numeroChip, onUpdate }: ChipResponsibleProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (newValue: string) => {
    try {
      const capitalizedValue = newValue.charAt(0).toUpperCase() + newValue.slice(1).toLowerCase();
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
      <Select 
        defaultValue={responsavelChip?.toLowerCase()}
        onValueChange={handleSave}
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <SelectTrigger className="bg-black/20 border-sky-600/20 text-white">
          <SelectValue placeholder="Selecione o responsável" />
        </SelectTrigger>
        <SelectContent>
          {USER_OPTIONS.map((user) => (
            <SelectItem key={user} value={user.toLowerCase()}>
              {user}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

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