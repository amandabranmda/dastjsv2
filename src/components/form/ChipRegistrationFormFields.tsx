import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface ChipRegistrationFormFieldsProps {
  formData: {
    numeroChip: string;
    localChip: string;
    statusChip: string;
  };
  setFormData: (data: any) => void;
  onRegister: () => void;
  searchNumber: string;
}

export function ChipRegistrationFormFields({ 
  formData, 
  setFormData, 
  onRegister,
  searchNumber 
}: ChipRegistrationFormFieldsProps) {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <Label>Local do Chip</Label>
        <Input
          placeholder="Digite o local do chip"
          value={formData.localChip}
          onChange={(e) => setFormData({ ...formData, localChip: e.target.value, numeroChip: searchNumber })}
          className="bg-white/5 border-emerald-600/20"
        />
      </div>

      <div>
        <Label>Status do Chip</Label>
        <Select 
          value={formData.statusChip}
          onValueChange={(value) => setFormData({ ...formData, statusChip: value, numeroChip: searchNumber })}
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