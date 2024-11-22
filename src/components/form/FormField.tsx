import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ChipSelectItem } from "./ChipSelectItem";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  releasedChips?: any[];
}

export function CustomFormField({ form, name, label, placeholder, releasedChips }: CustomFormFieldProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full h-20 justify-between bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors"
                    >
                      {field.value
                        ? releasedChips.find((chip) => chip.numeroChip === field.value)?.numeroChip
                        : placeholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-slate-950/90 border-emerald-600/20">
                    <Command>
                      <CommandInput 
                        placeholder="Buscar número do chip..." 
                        className="h-9 bg-transparent text-white"
                        value={searchValue}
                        onValueChange={setSearchValue}
                      />
                      <CommandEmpty className="text-white/70 py-2">Nenhum chip encontrado.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {releasedChips
                          ?.filter(chip => 
                            chip.numeroChip.toLowerCase().includes(searchValue.toLowerCase())
                          )
                          .map((chip) => (
                            <CommandItem
                              key={chip.numeroChip}
                              value={chip.numeroChip}
                              onSelect={() => {
                                field.onChange(chip.numeroChip);
                                setOpen(false);
                              }}
                              className="flex items-center justify-between gap-2 hover:bg-emerald-900/20 text-white"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-base">{chip.numeroChip}</span>
                                <span className="text-sm text-white/70">{chip.localChip || 'Sem local'}</span>
                              </div>
                              {field.value === chip.numeroChip && (
                                <Check className="h-4 w-4 text-emerald-500" />
                              )}
                            </CommandItem>
                          ))}
                        <CommandItem
                          value="custom"
                          onSelect={() => {
                            setShowCustomInput(true);
                            field.onChange("");
                            setOpen(false);
                          }}
                          className="hover:bg-emerald-900/20 text-white"
                        >
                          Digitar manualmente
                        </CommandItem>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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