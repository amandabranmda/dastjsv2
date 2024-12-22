import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { USER_OPTIONS } from "@/constants/userOptions";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ResponsavelSelectProps {
  chipNumber: string;
  currentValue: string;
  onUpdate: () => void;
}

export function ResponsavelSelect({ chipNumber, currentValue, onUpdate }: ResponsavelSelectProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const { toast } = useToast();

  const handleResponsavelChange = async (value: string) => {
    try {
      if (value === "custom") {
        setIsCustom(true);
        return;
      }

      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: value })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Responsável atualizado com sucesso!`,
        duration: 2000,
      });

      onUpdate();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar responsável",
        duration: 2000,
      });
    }
  };

  const handleCustomSubmit = async () => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: customValue })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: `Responsável atualizado com sucesso!`,
        duration: 2000,
      });

      setIsCustom(false);
      onUpdate();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar responsável",
        duration: 2000,
      });
    }
  };

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="Digite o nome"
          className="w-[180px]"
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCustom(false)}
        >
          Cancelar
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleCustomSubmit}
        >
          Salvar
        </Button>
      </div>
    );
  }

  return (
    <Select
      value={currentValue}
      onValueChange={handleResponsavelChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione um responsável" />
      </SelectTrigger>
      <SelectContent>
        {USER_OPTIONS.map((user) => (
          <SelectItem key={user} value={user}>
            {user}
          </SelectItem>
        ))}
        <SelectItem value="custom">Digitar manualmente</SelectItem>
      </SelectContent>
    </Select>
  );
}