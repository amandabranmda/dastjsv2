import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { USER_OPTIONS } from "@/constants/userOptions";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface UserSelectFieldProps {
  form: UseFormReturn<any>;
}

export function UserSelectField({ form }: UserSelectFieldProps) {
  const [showCustomUser, setShowCustomUser] = useState(false);

  return (
    <FormField
      control={form.control}
      name="user"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Usuário</FormLabel>
          <FormControl>
            {!showCustomUser ? (
              <Select
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomUser(true);
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {USER_OPTIONS.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Digitar manualmente</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Digite o nome do usuário"
                  {...field}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomUser(false)}
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