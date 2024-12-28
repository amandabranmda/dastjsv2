import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface ChipRegistrationFieldsProps {
  formData: {
    numeroChip: string;
    localChip: string;
    statusChip: string;
    chipCom: string; // New field
  };
  onFormDataChange: (data: any) => void;
  onRegister: () => void;
}

export function ChipRegistrationFields({
  formData,
  onFormDataChange,
  onRegister
}: ChipRegistrationFieldsProps) {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <Label>Local do Chip</Label>
        <Input
          placeholder="Digite o local do chip"
          value={formData.localChip}
          onChange={(e) => onFormDataChange({ ...formData, localChip: e.target.value })}
          className="bg-white/5 border-emerald-600/20"
        />
      </div>

      <div>
        <Label>Chip Com</Label>
        <Input
          placeholder="Digite com quem está o chip"
          value={formData.chipCom}
          onChange={(e) => onFormDataChange({ ...formData, chipCom: e.target.value })}
          className="bg-white/5 border-emerald-600/20"
        />
      </div>

      <div>
        <Label>Status do Chip</Label>
        <Select 
          value={formData.statusChip}
          onValueChange={(value) => onFormDataChange({ ...formData, statusChip: value })}
        >
          <SelectTrigger className="bg-white/5 border-emerald-600/20">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="liberado">Liberado</SelectItem>
            <SelectItem value="❌verificarDesconexao">Verificar Desconexão</SelectItem>
            <SelectItem value="✅emProducao">Em Produção</SelectItem>
            <SelectItem value="aguardando desbloqueio">Aguardando Desbloqueio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={onRegister}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        Cadastrar
      </Button>
    </div>
  );
}