import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ChipSearchField } from "./chip-registration/ChipSearchField";
import { ChipRegistrationFields } from "./chip-registration/ChipRegistrationFields";
import { ChipDetailsDisplay } from "./chip-registration/ChipDetailsDisplay";

interface ChipDetails {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  chipCom?: string;
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
    statusChip: "",
    chipCom: ""
  });

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearForm();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const clearForm = () => {
    setSearchNumber("");
    setChipExists(false);
    setChipDetails(null);
    setShowRegistrationForm(false);
    setFormData({
      numeroChip: "",
      localChip: "",
      statusChip: "",
      chipCom: ""
    });
  };

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error("Digite um número de chip");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip, chipCom")
        .eq("numeroChip", searchNumber);

      if (error) throw error;

      if (data && data.length > 0) {
        setChipExists(true);
        setChipDetails(data[0]);
        setShowRegistrationForm(false);
      } else {
        setChipExists(false);
        setChipDetails(null);
        setShowRegistrationForm(true);
        setFormData({ ...formData, numeroChip: searchNumber });
      }
    } catch (error) {
      console.error("Erro ao buscar chip:", error);
      toast.error("Erro ao buscar chip. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleRegister = async () => {
    if (!formData.numeroChip || !formData.localChip || !formData.statusChip) {
      toast.error("Preencha todos os campos obrigatórios");
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
        <ChipSearchField
          searchNumber={searchNumber}
          isSearching={isSearching}
          onSearchChange={setSearchNumber}
          onSearch={handleSearch}
          onClear={clearForm}
          onKeyPress={handleKeyPress}
        />

        {chipExists && chipDetails && (
          <ChipDetailsDisplay chipDetails={chipDetails} />
        )}

        {showRegistrationForm && (
          <ChipRegistrationFields
            formData={formData}
            onFormDataChange={setFormData}
            onRegister={handleRegister}
          />
        )}
      </Card>
    </div>
  );
}