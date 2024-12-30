import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChipDetails {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
  obsChip: string;
}

export function useChipSearch() {
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chipExists, setChipExists] = useState(false);
  const [chipDetails, setChipDetails] = useState<ChipDetails[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    numeroChip: "",
    localChip: "",
    statusChip: "",
    responsavelChip: "",
    obsChip: ""
  });

  const clearForm = () => {
    setSearchNumber("");
    setChipExists(false);
    setChipDetails([]);
    setShowRegistrationForm(false);
    setFormData({
      numeroChip: "",
      localChip: "",
      statusChip: "",
      responsavelChip: "",
      obsChip: ""
    });
  };

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error("Digite um número, local, status ou responsável do chip");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip, responsavelChip, obsChip")
        .or(`numeroChip.ilike.%${searchNumber}%,localChip.ilike.%${searchNumber}%,responsavelChip.ilike.%${searchNumber}%,statusChip.ilike.%${searchNumber}%`);

      if (error) throw error;

      if (data && data.length > 0) {
        const sortedData = [...data].sort((a, b) => {
          const aMatchesLocal = a.localChip?.toLowerCase().includes(searchNumber.toLowerCase());
          const bMatchesLocal = b.localChip?.toLowerCase().includes(searchNumber.toLowerCase());
          
          if (aMatchesLocal && !bMatchesLocal) return -1;
          if (!aMatchesLocal && bMatchesLocal) return 1;
          return 0;
        });

        setChipExists(true);
        setChipDetails(sortedData);
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

  return {
    searchNumber,
    setSearchNumber,
    isSearching,
    chipExists,
    chipDetails,
    showRegistrationForm,
    formData,
    setFormData,
    clearForm,
    handleSearch
  };
}