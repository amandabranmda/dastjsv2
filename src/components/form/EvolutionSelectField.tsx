import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface EvolutionSelectFieldProps {
  form: any;
  className?: string;
}

export function EvolutionSelectField({ form, className }: EvolutionSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="evolution"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg">
          <FormLabel className="text-lg font-semibold text-white/90">Evo</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className={cn("bg-white/5 border-white/10 text-white", className)}>
                <SelectValue placeholder="Selecione um..." />
              </SelectTrigger>
              <SelectContent className="glass-dropdown">
                <SelectItem value="evolution1">Evolution 1</SelectItem>
                <SelectItem value="evolution2">Evolution 2</SelectItem>
                <SelectItem value="evolution3">Evolution 3</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}