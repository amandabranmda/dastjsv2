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

  return (
    <div className="flex gap-2">
      <Input
        value={customValue}
        onChange={(e) => setCustomValue(e.target.value)}
        placeholder="Digite o nome"
        className="w-[180px] bg-white/5 border-white/10 text-white"
        onKeyPress={(e) => {
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
        onClick={onCancel}
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