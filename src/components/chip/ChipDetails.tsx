import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChipDetailsProps {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
  onUpdate: () => void;
}

export function ChipDetails({ numeroChip, localChip, statusChip, responsavelChip, onUpdate }: ChipDetailsProps) {
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

  const handleCopyChip = async () => {
    try {
      await navigator.clipboard.writeText(numeroChip);
      toast.success("Número do chip copiado!");
    } catch (error) {
      console.error("Erro ao copiar número:", error);
      toast.error("Erro ao copiar número do chip");
    }
  };

  return (
    <div className="p-4 bg-black/20 rounded-lg border border-sky-600/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-red-200">Número do Chip</Label>
          <p 
            className="text-red-100 cursor-pointer hover:text-red-300 transition-colors"
            onClick={handleCopyChip}
          >
            {numeroChip || '-'}
          </p>
        </div>
        <div>
          <Label className="text-red-200">Local do Chip</Label>
          <p className="text-red-100">{localChip || '-'}</p>
        </div>
        <div>
          <Label className="text-red-200">Status do Chip</Label>
          <p className="text-red-100">{statusChip || '-'}</p>
        </div>
        <div>
          <Label className="text-red-200">Responsável</Label>
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditValue(responsavelChip);
                }
              }}
              className="bg-white/5 border-red-600/20 text-red-100"
              autoFocus
            />
          ) : (
            <p 
              className="text-red-100 cursor-pointer hover:text-red-300 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {responsavelChip ? capitalizeFirstLetter(responsavelChip) : '-'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}