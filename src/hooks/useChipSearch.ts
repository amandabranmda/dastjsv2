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
      toast.error("Digite um termo para buscar");
      return;
    }

    setIsSearching(true);
    try {
      // Split search terms by comma and trim whitespace
      const searchTerms = searchNumber.split(',').map(term => term.trim());
      
      let query = supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip, responsavelChip, obsChip");

      // Apply each search term as a filter condition (AND)
      searchTerms.forEach(term => {
        query = query.or(`numeroChip.ilike.%${term}%,localChip.ilike.%${term}%,responsavelChip.ilike.%${term}%,statusChip.ilike.%${term}%`);
      });

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        // Filter results to only include items that match ALL search terms
        const filteredData = data.filter(item => {
          return searchTerms.every(term => {
            const termLower = term.toLowerCase();
            return (
              item.numeroChip?.toLowerCase().includes(termLower) ||
              item.localChip?.toLowerCase().includes(termLower) ||
              item.responsavelChip?.toLowerCase().includes(termLower) ||
              item.statusChip?.toLowerCase().includes(termLower)
            );
          });
        });

        // Sort filtered results
        const sortedData = [...filteredData].sort((a, b) => {
          // First, check for exact matches in any field
          const aExactMatch = searchTerms.some(term => 
            Object.values(a).some(value => 
              value?.toString().toLowerCase() === term.toLowerCase()
            )
          );
          const bExactMatch = searchTerms.some(term => 
            Object.values(b).some(value => 
              value?.toString().toLowerCase() === term.toLowerCase()
            )
          );

          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;

          // Then sort by how many exact matches
          const aExactMatchCount = searchTerms.filter(term =>
            Object.values(a).some(value =>
              value?.toString().toLowerCase() === term.toLowerCase()
            )
          ).length;
          const bExactMatchCount = searchTerms.filter(term =>
            Object.values(b).some(value =>
              value?.toString().toLowerCase() === term.toLowerCase()
            )
          ).length;

          return bExactMatchCount - aExactMatchCount;
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