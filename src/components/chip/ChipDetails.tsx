import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ChipNumber } from "./ChipNumber";
import { ChipLocation } from "./ChipLocation";
import { ChipStatus } from "./ChipStatus";
import { ChipResponsible } from "./ChipResponsible";

interface ChipDetailsProps {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
  onUpdate: () => void;
}

export function ChipDetails({ 
  numeroChip, 
  localChip, 
  statusChip, 
  responsavelChip, 
  onUpdate 
}: ChipDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(responsavelChip);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

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

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ statusChip: newStatus })
        .eq("numeroChip", numeroChip);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsEditingStatus(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'liberado':
        return 'bg-sky-500/20 text-sky-500';
      case '✅emproducao':
        return 'bg-emerald-500/20 text-emerald-500';
      case '❌verificardesconexao':
        return 'bg-red-500/20 text-red-500';
      case 'aguardando desbloqueio':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-xl border border-sky-600/20 shadow-lg hover:shadow-sky-600/10 transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <ChipNumber 
            numeroChip={numeroChip} 
            onCopy={handleCopyChip} 
          />
        </div>

        <div>
          <ChipLocation localChip={localChip} />
        </div>

        <div>
          <ChipStatus 
            statusChip={statusChip}
            isEditing={isEditingStatus}
            onStatusChange={handleStatusChange}
            onEditingChange={setIsEditingStatus}
            getStatusColor={getStatusColor}
          />
        </div>

        <div>
          <ChipResponsible 
            responsavelChip={responsavelChip}
            isEditing={isEditing}
            editValue={editValue}
            onEdit={() => setIsEditing(true)}
            onEditValueChange={setEditValue}
            onSave={handleSave}
            capitalizeFirstLetter={capitalizeFirstLetter}
          />
        </div>
      </div>
    </div>
  );
}