import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ChipSelectItem } from "./ChipSelectItem";

interface CustomFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  releasedChips?: any[];
}

export function CustomFormField({ form, name, label, placeholder, releasedChips }: CustomFormFieldProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg border border-emerald-600/20 hover:border-emerald-600/30 transition-colors">
          <FormLabel className="text-lg font-semibold text-white/90">{label}</FormLabel>
          <FormControl>
            {releasedChips ? (
              !showCustomInput ? (
                <Select 
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setShowCustomInput(true);
                      field.onChange("");
                    } else {
                      field.onChange(value);
                    }
                  }}
                >
                  <SelectTrigger className="h-20 bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="glass-dropdown max-h-[300px] border-emerald-600/20">
                    {releasedChips?.map((chip) => (
                      <ChipSelectItem 
                        key={chip.numeroChip}
                        numeroChip={chip.numeroChip}
                        localChip={chip.localChip}
                      />
                    ))}
                    <SelectItem value="custom" className="hover:bg-emerald-900/20">
                      Digitar manualmente
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input 
                    placeholder="Digite o nome da instância" 
                    className="bg-white/5 border-emerald-600/20 text-white"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomInput(false)}
                    className="w-full border-emerald-600/20 hover:bg-emerald-900/20"
                  >
                    Voltar para lista
                  </Button>
                </div>
              )
            ) : (
              <Input 
                placeholder={placeholder} 
                {...field} 
                className="bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors"
              />
            )}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
}