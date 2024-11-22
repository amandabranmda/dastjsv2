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

  const clearForm = () => {
    setSearchNumber("");
    setChipExists(false);
    setChipDetails(null);
    setShowRegistrationForm(false);
    setFormData({
      numeroChip: "",
      localChip: "",
      statusChip: ""
    });
  };

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
        setSearchNumber(""); // Clear search when showing registration form
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
      clearForm();
    } catch (error) {
      console.error("Erro ao cadastrar chip:", error);
      toast.error("Erro ao cadastrar chip");
    }
  };

  return (
    <div className="w-full">
      <Card className={`p-6 ${showRegistrationForm ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10' : 'bg-gradient-to-br from-sky-900/20 to-sky-800/10'} backdrop-blur-sm transition-colors duration-300`}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="chipNumber">Cadastro de Chip</Label>
            <Button 
              variant="ghost" 
              onClick={clearForm}
              className="text-sm hover:bg-white/5"
            >
              Limpar
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              id="chipNumber"
              placeholder="Digite o número do chip"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className={`bg-white/5 ${showRegistrationForm ? 'border-emerald-600/20' : 'border-sky-600/20'}`}
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className={showRegistrationForm ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'}
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {chipExists && chipDetails && (
          <div className="mt-4 space-y-4">
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
        )}

        {showRegistrationForm && (
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
              onClick={handleRegister}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Cadastrar
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}