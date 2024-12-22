import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_OPTIONS } from "@/constants/userOptions";
import { CustomResponsavelInput } from "./CustomResponsavelInput";

interface ResponsavelSelectProps {
  chipNumber: string;
  currentValue: string;
  onUpdate: () => void;
}

export function ResponsavelSelect({ chipNumber, currentValue, onUpdate }: ResponsavelSelectProps) {
  const [isCustom, setIsCustom] = useState(false);

  const handleResponsavelChange = async (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      return;
    }
  };

  if (isCustom) {
    return (
      <CustomResponsavelInput
        chipNumber={chipNumber}
        onCancel={() => setIsCustom(false)}
        onUpdate={() => {
          onUpdate();
          setIsCustom(false);
        }}
      />
    );
  }

  return (
    <Select onValueChange={handleResponsavelChange} defaultValue={currentValue}>
      <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
        <SelectValue placeholder="Selecione um responsável" />
      </SelectTrigger>
      <SelectContent className="glass-dropdown">
        {USER_OPTIONS.map((user) => (
          <SelectItem 
            key={user} 
            value={user}
            className="hover:bg-white/5"
          >
            {user}
          </SelectItem>
        ))}
        <SelectItem value="custom" className="hover:bg-white/5">
          Digitar manualmente
        </SelectItem>
      </SelectContent>
    </Select>
  );
}