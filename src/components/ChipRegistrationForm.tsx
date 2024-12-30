import { useEffect } from "react";
import { Card } from "./ui/card";
import { SearchBar } from "./chip/SearchBar";
import { SearchResults } from "./chip/SearchResults";
import { ChipRegistration } from "./chip/ChipRegistration";
import { useChipSearch } from "@/hooks/useChipSearch";

export function ChipRegistrationForm() {
  const {
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
  } = useChipSearch();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearForm();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [clearForm]);

  return (
    <div className="w-full">
      <Card className={`p-4 sm:p-6 ${showRegistrationForm ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10' : 'bg-gradient-to-br from-sky-900/20 to-sky-800/10'} backdrop-blur-sm transition-colors duration-300`}>
        <div className="flex flex-col space-y-4">
          <SearchBar 
            searchNumber={searchNumber}
            setSearchNumber={setSearchNumber}
            handleSearch={handleSearch}
            isSearching={isSearching}
            clearForm={clearForm}
            showRegistrationForm={showRegistrationForm}
          />

          {chipExists && chipDetails.length > 0 && (
            <SearchResults 
              chipDetails={chipDetails}
              onUpdate={handleSearch}
              searchNumber={searchNumber}
            />
          )}

          {showRegistrationForm && (
            <ChipRegistration
              formData={formData}
              setFormData={setFormData}
              searchNumber={searchNumber}
              onSuccess={clearForm}
            />
          )}
        </div>
      </Card>
    </div>
  );
}