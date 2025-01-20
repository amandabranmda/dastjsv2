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
    <Card className="glass-card">
      <div className="flex items-center justify-between p-4 border-b border-sky-600/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-white">
              {numeroChip}
            </span>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-sky-500/10"
            >
              <Copy className="h-4 w-4 text-sky-400" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {localChip || "Não informado"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`status-badge ${statusChip === 'emProducao' ? 'online' : 'closed'}`}>
              {statusChip}
            </span>
            {statusInstancia && (
              <span className="status-badge sending">
                {statusInstancia}
              </span>
            )}
          </div>
          <Button
            onClick={handleStatusUpdate}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-sky-500/10"
          >
            <Pencil className="h-4 w-4 text-sky-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
}