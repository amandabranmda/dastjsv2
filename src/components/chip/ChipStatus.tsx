import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChipStatusProps {
  statusChip: string;
  numeroChip: string;
  onUpdate: () => void;
}

export function ChipStatus({ statusChip, numeroChip, onUpdate }: ChipStatusProps) {
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'liberado':
        return 'bg-sky-500/20 text-sky-400';
      case '✅emproducao':
        return 'bg-emerald-500/20 text-emerald-400';
      case '❌verificardesconexao':
        return 'bg-red-500/20 text-red-400';
      case 'aguardando desbloqueio':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isEditing) {
    return (
      <Select 
        defaultValue={statusChip}
        onValueChange={handleStatusChange}
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <SelectTrigger className="bg-black/20 border-sky-600/20 text-white">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="liberado">Liberado</SelectItem>
          <SelectItem value="❌verificarDesconexao">Verificar Desconexão</SelectItem>
          <SelectItem value="✅emProducao">Em Produção</SelectItem>
          <SelectItem value="aguardando desbloqueio">Aguardando Desbloqueio</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 group cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusChip)} cursor-pointer hover:opacity-80 transition-opacity`}>
        {statusChip || '-'}
      </div>
      <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
    </div>
  );
}