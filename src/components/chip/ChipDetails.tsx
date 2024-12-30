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
}

export function ChipDetails({ numeroChip, localChip, statusChip, responsavelChip }: ChipDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(responsavelChip);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: editValue })
        .eq("numeroChip", numeroChip);

      if (error) throw error;

      toast.success("Responsável atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error);
      toast.error("Erro ao atualizar responsável");
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <p className="text-center text-red-200 mb-4">
        Este número já consta no banco de dados
      </p>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-red-200">Número do Chip</Label>
          <p className="text-red-100">{numeroChip || '-'}</p>
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
              {responsavelChip || '-'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}