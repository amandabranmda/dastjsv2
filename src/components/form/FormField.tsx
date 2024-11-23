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

export function CustomFormField({ 
  form, 
  name, 
  label, 
  placeholder, 
  releasedChips,
  className 
}: CustomFormFieldProps) {
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
                  defaultValue={field.value}
                >
                  <SelectTrigger className={cn("bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors", className)}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="glass-dropdown">
                    {releasedChips?.map((chip) => (
                      <ChipSelectItem
                        key={chip.numeroChip}
                        numeroChip={chip.numeroChip}
                        localChip={chip.localChip}
                      />
                    ))}
                    <SelectItem value="custom">Digitar manualmente</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Digite o nome da instância"
                    className={cn("bg-white/5 border-emerald-600/20 text-white", className)}
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
                className={cn("bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors", className)}
              />
            )}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
}