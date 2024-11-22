import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

const projects = [
  "ProjetHotGPT",
  "Carol",
  "Adm",
  "Outro"
] as const;

interface ProjectSelectFieldProps {
  form: UseFormReturn<any>;
}

export function ProjectSelectField({ form }: ProjectSelectFieldProps) {
  const [showCustomProject, setShowCustomProject] = useState(false);

  return (
    <FormField
      control={form.control}
      name="project"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg border border-emerald-600/20 hover:border-emerald-600/30 transition-colors">
          <FormLabel className="text-lg font-semibold text-white/90">Projeto</FormLabel>
          <FormControl>
            {!showCustomProject ? (
              <Select
                onValueChange={(value) => {
                  if (value === "Outro") {
                    setShowCustomProject(true);
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="bg-white/5 border-emerald-600/20 text-white hover:bg-emerald-900/20 transition-colors">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent className="glass-dropdown border-emerald-600/20">
                  {projects.map((project) => (
                    <SelectItem 
                      key={project} 
                      value={project}
                      className="hover:bg-emerald-900/20"
                    >
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Digite o nome do projeto"
                  className="bg-white/5 border-emerald-600/20 text-white"
                  {...field}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomProject(false)}
                  className="w-full border-emerald-600/20 hover:bg-emerald-900/20"
                >
                  Voltar para lista
                </Button>
              </div>
            )}
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
}