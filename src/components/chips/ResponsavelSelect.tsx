import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_OPTIONS } from "@/constants/userOptions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    if (value === "custom") {
      setIsCustom(true);
      return;
    }

    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: value })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: "Responsável atualizado com sucesso!",
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
    if (!customValue.trim()) {
      toast({
        variant: "destructive",
        description: "Por favor, digite um nome válido",
        duration: 2000,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ responsavelChip: customValue.trim() })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: "Responsável atualizado com sucesso!",
        duration: 2000,
      });

      setIsCustom(false);
      setCustomValue("");
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
          className="w-[180px] bg-white/5 border-white/10 text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCustomSubmit();
            }
          }}
          autoFocus
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setIsCustom(false);
            setCustomValue("");
          }}
          className="border-white/10 text-white hover:bg-white/5"
        >
          Cancelar
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleCustomSubmit}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Salvar
        </Button>
      </div>
    );
  }

  return (
    <Select onValueChange={handleResponsavelChange} defaultValue={currentValue}>
      <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
        <SelectValue placeholder="Selecione um responsável" />
      </SelectTrigger>
      <SelectContent className="glass-dropdown">
        {USER_OPTIONS.map((user) => (
          <SelectItem 
            key={user} 
            value={user}
            className="hover:bg-white/5"
          >
            {user}
          </SelectItem>
        ))}
        <SelectItem value="custom" className="hover:bg-white/5">
          Digitar manualmente
        </SelectItem>
      </SelectContent>
    </Select>
  );
}