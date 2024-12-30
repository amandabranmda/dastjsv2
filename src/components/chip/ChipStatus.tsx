import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ChipStatusProps {
  statusChip: string;
  isEditing: boolean;
  onStatusChange: (value: string) => void;
  onEditingChange: (editing: boolean) => void;
  getStatusColor: (status: string) => string;
}

export function ChipStatus({ 
  statusChip, 
  isEditing, 
  onStatusChange, 
  onEditingChange,
  getStatusColor 
}: ChipStatusProps) {
  if (isEditing) {
    return (
      <Select 
        defaultValue={statusChip}
        onValueChange={onStatusChange}
        onOpenChange={(open) => !open && onEditingChange(false)}
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
      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusChip)} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={() => onEditingChange(true)}
    >
      {statusChip || '-'}
    </div>
  );
}