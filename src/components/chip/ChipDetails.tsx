import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Copy, Edit2 } from "lucide-react";

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
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Número do Chip</Label>
          <div 
            className="flex items-center gap-2 group cursor-pointer"
            onClick={handleCopyChip}
          >
            <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
              {numeroChip || '-'}
            </p>
            <Copy className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Local do Chip</Label>
          <p className="text-white font-medium">{localChip || '-'}</p>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Status do Chip</Label>
          {isEditingStatus ? (
            <Select 
              defaultValue={statusChip}
              onValueChange={handleStatusChange}
              onOpenChange={(open) => !open && setIsEditingStatus(false)}
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
          ) : (
            <div 
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusChip)} cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => setIsEditingStatus(true)}
            >
              {statusChip || '-'}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Responsável</Label>
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
              className="bg-black/20 border-sky-600/20 text-white"
              autoFocus
            />
          ) : (
            <div 
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
                {responsavelChip ? capitalizeFirstLetter(responsavelChip) : '-'}
              </p>
              <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}