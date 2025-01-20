import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Copy, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ChipDetailsProps {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
  obsChip: string;
  statusInstancia?: string;
  onUpdate: () => void;
}

export function ChipDetails({
  numeroChip,
  localChip,
  statusChip,
  responsavelChip,
  obsChip,
  statusInstancia,
  onUpdate
}: ChipDetailsProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(numeroChip);
    toast.success("Número copiado para a área de transferência!");
  };

  const handleStatusUpdate = async () => {
    try {
      const { error } = await supabase
        .from('1-chipsInstancias')
        .update({ statusChip: statusChip === 'liberado' ? 'emProducao' : 'liberado' })
        .eq('numeroChip', numeroChip);

      if (error) throw error;

      onUpdate();
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-[#1A1F2C]/80 border border-sky-600/20 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{numeroChip}</span>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-sky-400 hover:text-sky-300"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-gray-400">{localChip || "chip803"}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            statusChip === 'emProducao' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'
          }`}>
            {statusChip === 'emProducao' ? 'emProducao' : 'liberado'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Loja</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-sky-400 hover:text-sky-300"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        onClick={handleStatusUpdate}
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-sky-400 hover:text-sky-300"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}