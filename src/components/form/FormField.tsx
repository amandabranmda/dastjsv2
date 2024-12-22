import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ChipSelectItem } from "./ChipSelectItem";
import { cn } from "@/lib/utils";

interface CustomFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  releasedChips?: any[];
  className?: string;
}

const generateSequentialNumbers = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => String(i + start));
};

export function CustomFormField({ 
  form, 
  name, 
  label, 
  placeholder, 
  releasedChips,
  className 
}: CustomFormFieldProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const sequentialNumbers = generateSequentialNumbers(1, 10);

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      form.setValue(name, customValue.trim());
      setShowCustomInput(false);
      setCustomValue("");
    }
  };

  const handleCancel = () => {
    setShowCustomInput(false);
    setCustomValue("");
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg border border-emerald-600/20 hover:border-emerald-600/30 transition-colors">
          <FormLabel className="text-lg font-semibold text-white/90">{label}</FormLabel>
          <FormControl>
            {!showCustomInput ? (
              <Select
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomInput(true);
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className={cn("bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors", className)}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="glass-dropdown">
                  {sequentialNumbers.map((number) => (
                    <SelectItem 
                      key={number} 
                      value={number}
                      className="hover:bg-emerald-900/20"
                    >
                      {number}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="hover:bg-emerald-900/20">Digitar manualmente</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Digite o nome da instância"
                  className={cn("bg-white/5 border-emerald-600/20 text-white", className)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomSubmit();
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex-1 border-emerald-600/20 hover:bg-emerald-900/20"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleCustomSubmit}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
}