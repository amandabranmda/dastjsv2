import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface CustomResponsavelInputProps {
  chipNumber: string;
  onCancel: () => void;
  onUpdate: () => void;
}

export function CustomResponsavelInput({ chipNumber, onCancel, onUpdate }: CustomResponsavelInputProps) {
  const [customValue, setCustomValue] = useState("");
  const { toast } = useToast();

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

      onCancel();
      onUpdate();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar responsável",
        duration: 2000,
      });
    }
  };

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
        onClick={onCancel}
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