import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EvolutionSelectFieldProps {
  form: any;
  className?: string;
}

export function EvolutionSelectField({ form, className }: EvolutionSelectFieldProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const numbers = Array.from({ length: 10 }, (_, i) => `00${i + 1}`.slice(-3));

  return (
    <FormField
      control={form.control}
      name="evolution"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg">
          <FormLabel className="text-lg font-semibold text-white/90">Evo</FormLabel>
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
                <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", className)}>
                  <SelectValue placeholder="Selecione um..." />
                </SelectTrigger>
                <SelectContent className="glass-dropdown">
                  <SelectItem value="custom" className="hover:bg-white/5">
                    Digitar manualmente
                  </SelectItem>
                  {numbers.map((number) => (
                    <SelectItem 
                      key={number} 
                      value={number}
                      className="hover:bg-white/5"
                    >
                      {number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Digite o número"
                  className={cn("bg-white/5 border-white/10 text-white", className)}
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}