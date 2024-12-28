import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface ChipSearchFieldProps {
  searchNumber: string;
  isSearching: boolean;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ChipSearchField({
  searchNumber,
  isSearching,
  onSearchChange,
  onSearch,
  onClear,
  onKeyPress
}: ChipSearchFieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="chipNumber">Consulta/Cadastro Chip</Label>
        <Button 
          variant="ghost" 
          onClick={onClear}
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
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="bg-white/5 border-sky-600/20"
        />
        <Button 
          onClick={onSearch}
          disabled={isSearching}
          className="bg-sky-600 hover:bg-sky-700"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </div>
  );
}