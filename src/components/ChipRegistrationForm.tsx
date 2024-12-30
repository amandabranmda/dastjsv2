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
  const [chipDetails, setChipDetails] = useState<ChipDetails | null>(null);
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
    setChipDetails(null);
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
      toast.error("Digite um número ou local do chip");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip, responsavelChip")
        .or(`numeroChip.ilike.%${searchNumber}%,localChip.ilike.%${searchNumber}%`);

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
        <SearchBar 
          searchNumber={searchNumber}
          setSearchNumber={setSearchNumber}
          handleSearch={handleSearch}
          isSearching={isSearching}
          clearForm={clearForm}
          showRegistrationForm={showRegistrationForm}
        />

        {chipExists && chipDetails && (
          <ChipDetails 
            localChip={chipDetails.localChip} 
            statusChip={chipDetails.statusChip}
            responsavelChip={chipDetails.responsavelChip}
          />
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