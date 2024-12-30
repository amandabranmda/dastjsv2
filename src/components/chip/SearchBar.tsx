import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchBarProps {
  searchNumber: string;
  setSearchNumber: (value: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  clearForm: () => void;
  showRegistrationForm: boolean;
}

export function SearchBar({ 
  searchNumber, 
  setSearchNumber, 
  handleSearch, 
  isSearching,
  clearForm,
  showRegistrationForm
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="chipNumber">Consulta/Cadastro Chip</Label>
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
          placeholder="Digite o número, local, status ou responsável do chip"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          onKeyPress={handleKeyPress}
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
  );
}