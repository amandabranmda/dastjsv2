import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

const EVOLUTION_OPTIONS = [
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010"
] as const;

interface EvolutionSelectFieldProps {
  form: UseFormReturn<any>;
}

export function EvolutionSelectField({ form }: EvolutionSelectFieldProps) {
  const [showCustomEvolution, setShowCustomEvolution] = useState(false);

  return (
    <FormField
      control={form.control}
      name="evolution"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg">
          <FormLabel className="text-lg font-semibold text-white/90">Evolution</FormLabel>
          <FormControl>
            {!showCustomEvolution ? (
              <Select
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomEvolution(true);
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-emerald-900/20 transition-colors">
                  <SelectValue placeholder="Selecione um evolution" />
                </SelectTrigger>
                <SelectContent className="glass-dropdown">
                  {EVOLUTION_OPTIONS.map((evolution) => (
                    <SelectItem key={evolution} value={evolution}>
                      {evolution}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Digitar manualmente</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Digite o evolution"
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomEvolution(false)}
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