import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { SearchBar } from "./chip/SearchBar";
import { ChipRegistrationFormFields } from "./form/ChipRegistrationFormFields";
import { ChipDetails } from "./chip/ChipDetails";

interface ChipDetails {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
}

export function ChipRegistrationForm() {
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chipExists, setChipExists] = useState(false);
  const [chipDetails, setChipDetails] = useState<ChipDetails[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    numeroChip: "",
    localChip: "",
    statusChip: "",
    responsavelChip: ""
  });

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearForm();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  const clearForm = () => {
    setSearchNumber("");
    setChipExists(false);
    setChipDetails([]);
    setShowRegistrationForm(false);
    setFormData({
      numeroChip: "",
      localChip: "",
      statusChip: "",
      responsavelChip: ""
    });
  };

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error("Digite um número, local ou responsável do chip");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip, responsavelChip")
        .or(`numeroChip.ilike.%${searchNumber}%,localChip.ilike.%${searchNumber}%,responsavelChip.ilike.%${searchNumber}%`);

      if (error) throw error;

      if (data && data.length > 0) {
        setChipExists(true);
        setChipDetails(data);
        setShowRegistrationForm(false);
      } else {
        setChipExists(false);
        setChipDetails([]);
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
      <Card className={`p-4 sm:p-6 ${showRegistrationForm ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10' : 'bg-gradient-to-br from-sky-900/20 to-sky-800/10'} backdrop-blur-sm transition-colors duration-300`}>
        <SearchBar 
          searchNumber={searchNumber}
          setSearchNumber={setSearchNumber}
          handleSearch={handleSearch}
          isSearching={isSearching}
          clearForm={clearForm}
          showRegistrationForm={showRegistrationForm}
        />

        {chipExists && chipDetails.length > 0 && (
          <div className="mt-4 space-y-6">
            <p className="text-center text-red-200 mb-4">
              {chipDetails.length === 1 
                ? "Este número já consta no banco de dados"
                : `Foram encontrados ${chipDetails.length} resultados`}
            </p>
            <div className="space-y-6">
              {chipDetails.map((chip) => (
                <ChipDetails 
                  key={chip.numeroChip}
                  numeroChip={chip.numeroChip}
                  localChip={chip.localChip} 
                  statusChip={chip.statusChip}
                  responsavelChip={chip.responsavelChip}
                  onUpdate={handleSearch}
                />
              ))}
            </div>
          </div>
        )}

        {showRegistrationForm && (
          <ChipRegistrationFormFields
            formData={formData}
            setFormData={setFormData}
            onRegister={handleRegister}
            searchNumber={searchNumber}
          />
        )}
      </Card>
    </div>
  );
}