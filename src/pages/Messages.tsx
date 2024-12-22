import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const LOJAS = [
  "Loja 1",
  "Loja 2",
  "Loja 3",
  "Loja 4",
  "Loja 5",
] as const;

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: liberatedChips, refetch } = useQuery({
    queryKey: ["liberated-chips", searchTerm],
    queryFn: async () => {
      const query = supabase
        .from("1-chipsInstancias")
        .select("numeroChip,localChip,responsavelChip")
        .eq("statusChip", "liberado");

      if (searchTerm) {
        query.or(`numeroChip.ilike.%${searchTerm}%,localChip.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleLojaChange = async (chipNumber: string, newValue: string) => {
    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .update({ localChip: newValue })
        .eq("numeroChip", chipNumber);

      if (error) throw error;

      toast({
        description: "Local atualizado com sucesso!",
        duration: 2000,
      });

      refetch();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar local",
        duration: 2000,
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Chips em Produção Externa</h1>
      
      <div className="space-y-4">
        <Input
          placeholder="Pesquisar chips liberados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        {liberatedChips && liberatedChips.length > 0 ? (
          <div className="bg-card rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Número do Chip</th>
                  <th className="text-left py-2">Local</th>
                  <th className="text-left py-2">Responsável</th>
                </tr>
              </thead>
              <tbody>
                {liberatedChips.map((chip) => (
                  <tr key={chip.numeroChip} className="border-t border-border">
                    <td className="py-2">{chip.numeroChip}</td>
                    <td className="py-2">
                      <Select
                        defaultValue={chip.localChip || ""}
                        onValueChange={(value) => handleLojaChange(chip.numeroChip, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione uma loja" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOJAS.map((loja) => (
                            <SelectItem key={loja} value={loja}>
                              {loja}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Digitar manualmente</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2">{chip.responsavelChip || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum chip liberado encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Messages;