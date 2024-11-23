import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface ChipSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  className?: string;
}

export function ChipSelect({ form, name, label, placeholder, className }: ChipSelectProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const { data: releasedChips } = useQuery({
    queryKey: ["released-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip")
        .eq("statusChip", "liberado");

      if (error) throw error;
      return data;
    }
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem 
                    value="custom"
                    className="hover:bg-white/5"
                  >
                    Digitar manualmente
                  </SelectItem>
                  {releasedChips?.map((chip) => (
                    <SelectItem 
                      key={chip.numeroChip} 
                      value={chip.numeroChip}
                      className="flex items-center justify-between gap-2 hover:bg-white/5"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-base">{chip.numeroChip}</span>
                        <span className="text-sm text-muted-foreground">{chip.localChip || 'Sem local'}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Digite o número do chip"
                  className={className}
                  {...field}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomInput(false)}
                  className="w-full"
                >
                  Voltar para lista
                </Button>
              </div>
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}