import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

const DEVICE_OPTIONS = [
  "Android",
  "iPhone",
  "Windows",
  "Mac",
  "Linux"
] as const;

interface DeviceSelectFieldProps {
  form: UseFormReturn<any>;
}

export function DeviceSelectField({ form }: DeviceSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="device"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg">
          <FormLabel className="text-lg font-semibold text-white/90">Dispositivo</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione um dispositivo" />
              </SelectTrigger>
              <SelectContent className="glass-dropdown">
                {DEVICE_OPTIONS.map((device) => (
                  <SelectItem key={device} value={device}>
                    {device}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}