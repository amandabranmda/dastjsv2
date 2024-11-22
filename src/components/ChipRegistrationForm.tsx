import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChipDetails {
  numeroChip: string;
  localChip: string;
  statusChip: string;
}

export function ChipRegistrationForm() {
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chipExists, setChipExists] = useState(false);
  const [chipDetails, setChipDetails] = useState<ChipDetails | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    numeroChip: "",
    localChip: "",
    statusChip: ""
  });

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error("Digite um número de chip");
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip")
        .eq("numeroChip", searchNumber)
        .single();

      if (data) {
        setChipExists(true);
        setChipDetails(data);
        setShowRegistrationForm(false);
      } else {
        setChipExists(false);
        setChipDetails(null);
        setShowRegistrationForm(true);
        setFormData({ ...formData, numeroChip: searchNumber });
      }
    } catch (error) {
      console.error("Erro ao buscar chip:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.numeroChip || !formData.localChip || !formData.statusChip) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .insert([formData]);

      if (error) throw error;

      toast.success("Chip cadastrado com sucesso!");
      setShowRegistrationForm(false);
      setSearchNumber("");
      setFormData({
        numeroChip: "",
        localChip: "",
        statusChip: ""
      });
    } catch (error) {
      console.error("Erro ao cadastrar chip:", error);
      toast.error("Erro ao cadastrar chip");
    }
  };

  return (
    <div className="w-full">
      <Card className="p-6 bg-gradient-to-br from-sky-900/20 to-sky-800/10 backdrop-blur-sm">
        <div className="space-y-4">
          <Label htmlFor="chipNumber">Cadastro de Chip</Label>
          <div className="flex gap-2">
            <Input
              id="chipNumber"
              placeholder="Digite o número do chip"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="bg-white/5 border-sky-600/20"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>
      </Card>

      {chipExists && chipDetails && (
        <Card className="p-6 mt-4 bg-red-900/20 backdrop-blur-sm border-red-600/20">
          <div className="space-y-4">
            <p className="text-center text-red-200 mb-4">
              Este número já consta no banco de dados
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-red-200">Local do Chip</Label>
                <p className="text-red-100">{chipDetails.localChip || '-'}</p>
              </div>
              <div>
                <Label className="text-red-200">Status do Chip</Label>
                <p className="text-red-100">{chipDetails.statusChip || '-'}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {showRegistrationForm && (
        <Card className="p-6 mt-4 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <Label>Número do Chip</Label>
              <Input
                value={formData.numeroChip}
                readOnly
                className="bg-white/5 border-emerald-600/20"
              />
            </div>
            
            <div>
              <Label>Local do Chip</Label>
              <Input
                placeholder="Digite o local do chip"
                value={formData.localChip}
                onChange={(e) => setFormData({ ...formData, localChip: e.target.value })}
                className="bg-white/5 border-emerald-600/20"
              />
            </div>

            <div>
              <Label>Status do Chip</Label>
              <Select 
                value={formData.statusChip}
                onValueChange={(value) => setFormData({ ...formData, statusChip: value })}
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
              onClick={handleRegister}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Cadastrar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}