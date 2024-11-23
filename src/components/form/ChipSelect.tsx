import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UseFormReturn } from "react-hook-form";

interface ChipSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  className?: string;
}

export function ChipSelect({ form, name, label, placeholder, className }: ChipSelectProps) {
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
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
        </FormItem>
      )}
    />
  );
}