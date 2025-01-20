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
    <Card className="p-4 space-y-4 bg-card/50">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-card-foreground">
              {numeroChip}
            </h3>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Local: {localChip || "Não informado"}
          </p>
        </div>
        <Button
          onClick={handleStatusUpdate}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Pencil className="w-4 h-4" />
          {statusChip === 'liberado' ? 'Liberar' : 'Em Produção'}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="text-sm font-medium">Status do Chip:</span>
          <span className={`text-sm ${statusChip === 'liberado' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {statusChip}
          </span>
        </div>
        {statusInstancia && (
          <div className="flex gap-2">
            <span className="text-sm font-medium">Status da Instância:</span>
            <span className="text-sm text-sky-400">
              {statusInstancia}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="text-sm font-medium">Responsável:</span>
          <span className="text-sm text-muted-foreground">
            {responsavelChip || "Não informado"}
          </span>
        </div>
        {obsChip && (
          <div className="flex gap-2">
            <span className="text-sm font-medium">Observações:</span>
            <span className="text-sm text-muted-foreground">{obsChip}</span>
          </div>
        )}
      </div>
    </Card>
  );
}