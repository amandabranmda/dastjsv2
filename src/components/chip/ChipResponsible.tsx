import { useState } from "react";
import { Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { USER_OPTIONS, addNewUser } from "@/constants/userOptions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ChipResponsibleProps {
  responsavelChip: string;
  numeroChip: string;
  onUpdate: () => void;
}

export function ChipResponsible({ responsavelChip, numeroChip, onUpdate }: ChipResponsibleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleSave = async (newValue: string) => {
    try {
      if (newValue === "custom") {
        setShowCustomInput(true);
        return;
      }

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

  const handleCustomSave = async () => {
    if (!customValue.trim()) {
      toast.error("Digite um nome válido");
      return;
    }

    try {
      const capitalizedValue = customValue.charAt(0).toUpperCase() + customValue.slice(1).toLowerCase();
      
      // Add to USER_OPTIONS
      addNewUser(capitalizedValue);

      // Update in database
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: capitalizedValue })
        .eq("numeroChip", numeroChip);

      if (error) throw error;

      toast.success("Responsável atualizado com sucesso!");
      setShowCustomInput(false);
      setIsEditing(false);
      setCustomValue("");
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error);
      toast.error("Erro ao atualizar responsável");
    }
  };

  if (showCustomInput) {
    return (
      <div className="space-y-2">
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="Digite o nome do responsável"
          className="bg-black/20 border-sky-600/20 text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCustomSave();
            }
          }}
          autoFocus
        />
        <div className="flex gap-2">
          <Button 
            onClick={handleCustomSave}
            className="w-full bg-sky-600 hover:bg-sky-700"
          >
            Salvar
          </Button>
          <Button 
            onClick={() => {
              setShowCustomInput(false);
              setIsEditing(false);
            }}
            variant="outline"
            className="w-full border-sky-600/20 hover:bg-sky-950/50"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

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
          <SelectItem value="custom">Digite manualmente</SelectItem>
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