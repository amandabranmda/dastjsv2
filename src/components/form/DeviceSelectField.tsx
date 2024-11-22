import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

const DEVICE_OPTIONS = [
  "App Deletado",
  "Cell",
  "Emulador"
] as const;

interface DeviceSelectFieldProps {
  form: UseFormReturn<any>;
}

export function DeviceSelectField({ form }: DeviceSelectFieldProps) {
  const [showCustomDevice, setShowCustomDevice] = useState(false);

  return (
    <FormField
      control={form.control}
      name="device"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg">
          <FormLabel className="text-lg font-semibold text-white/90">Dispositivo</FormLabel>
          <FormControl>
            {!showCustomDevice ? (
              <Select
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomDevice(true);
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-emerald-900/20 transition-colors">
                  <SelectValue placeholder="Selecione um dispositivo" />
                </SelectTrigger>
                <SelectContent className="glass-dropdown">
                  {DEVICE_OPTIONS.map((device) => (
                    <SelectItem key={device} value={device}>
                      {device}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Digitar manualmente</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Digite o nome do dispositivo"
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomDevice(false)}
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