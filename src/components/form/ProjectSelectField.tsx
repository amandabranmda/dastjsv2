import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

const projects = [
  "ProjetHotGPT",
  "Carol",
  "Adm",
  "Outro"
] as const;

interface ProjectSelectFieldProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function ProjectSelectField({ form, className }: ProjectSelectFieldProps) {
  const [showCustomProject, setShowCustomProject] = useState(false);

  return (
    <FormField
      control={form.control}
      name="project"
      render={({ field }) => (
        <FormItem className="glass-card p-4 rounded-lg border border-sky-600/20 hover:border-sky-600/30 transition-colors">
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
                <SelectTrigger className={cn("bg-white/5 border-sky-600/20 text-white hover:bg-sky-900/20 transition-colors", className)}>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent className="glass-dropdown border-sky-600/20">
                  {projects.map((project) => (
                    <SelectItem 
                      key={project} 
                      value={project}
                      className="hover:bg-sky-900/20"
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
                  className={cn("bg-white/5 border-sky-600/20 text-white", className)}
                  {...field}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomProject(false)}
                  className="w-full border-sky-600/20 hover:bg-sky-900/20"
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