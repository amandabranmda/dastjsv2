import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CustomFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  children?: React.ReactNode;
}

export function CustomFormField({ form, name, label, placeholder, children }: CustomFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg">
          <FormLabel className="text-lg font-semibold text-white/90">{label}</FormLabel>
          <FormControl>
            {children || (
              <Input 
                placeholder={placeholder} 
                {...field} 
                className="bg-white/5 border-white/10 text-white"
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}