import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { UserSelectField } from "./form/UserSelectField"
import { ChipSelectItem } from "./form/ChipSelectItem"
import { CustomFormField } from "./form/FormField"
import { DeviceSelectField } from "./form/DeviceSelectField"
import { Input } from "./ui/input"
import { EvolutionSelectField } from "./form/EvolutionSelectField"

const formSchema = z.object({
  instanceName: z.string().min(2, {
    message: "Nome da instância deve ter pelo menos 2 caracteres.",
  }),
  evolution: z.string().min(2, {
    message: "Evolution deve ter pelo menos 2 caracteres.",
  }),
  user: z.string().min(2, {
    message: "Usuário deve ter pelo menos 2 caracteres.",
  }),
  project: z.string().min(2, {
    message: "Projeto deve ter pelo menos 2 caracteres.",
  }),
  device: z.string().min(2, {
    message: "Dispositivo deve ser selecionado.",
  }),
})

const projects = [
  "ProjetHotGPT",
  "Carol",
  "Adm",
  "Outro"
]

export function CreateInstanceForm({ onClose }: { onClose: () => void }) {
  const [showCustomProject, setShowCustomProject] = useState(false);
  const [showCustomInstance, setShowCustomInstance] = useState(false);
  
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: "",
      evolution: "",
      user: "",
      project: "",
      device: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('YOUR_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Falha ao criar instância');

      toast.success("Instância criada com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao criar instância. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <CustomFormField
            form={form}
            name="instanceName"
            label="Nome Instância"
            placeholder="Selecione um número de chip"
          >
            {!showCustomInstance ? (
              <Select 
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomInstance(true);
                    form.setValue("instanceName", "");
                  } else {
                    form.setValue("instanceName", value);
                  }
                }}
              >
                <SelectTrigger className="h-20 bg-white/5 border-white/10 text-white hover:bg-emerald-900/20 transition-colors">
                  <SelectValue placeholder="Selecione um número de chip" />
                </SelectTrigger>
                <SelectContent className="glass-dropdown max-h-[300px]">
                  {releasedChips?.map((chip) => (
                    <ChipSelectItem 
                      key={chip.numeroChip}
                      numeroChip={chip.numeroChip}
                      localChip={chip.localChip}
                    />
                  ))}
                  <SelectItem value="custom">Digitar manualmente</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input 
                  placeholder="Digite o nome da instância" 
                  className="bg-white/5 border-white/10 text-white"
                  onChange={(e) => form.setValue("instanceName", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomInstance(false)}
                  className="w-full"
                >
                  Voltar para lista
                </Button>
              </div>
            )}
          </CustomFormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EvolutionSelectField form={form} />

            <CustomFormField
              form={form}
              name="project"
              label="Projeto"
              placeholder="Selecione um projeto"
            >
              {!showCustomProject ? (
                <Select 
                  onValueChange={(value) => {
                    if (value === "Outro") {
                      setShowCustomProject(true);
                      form.setValue("project", "");
                    } else {
                      form.setValue("project", value);
                    }
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-emerald-900/20 transition-colors">
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent className="glass-dropdown">
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input 
                    placeholder="Digite o nome do projeto" 
                    className="bg-white/5 border-white/10 text-white"
                    onChange={(e) => form.setValue("project", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomProject(false)}
                    className="w-full"
                  >
                    Voltar para lista
                  </Button>
                </div>
              )}
            </CustomFormField>

            <UserSelectField form={form} />
            <DeviceSelectField form={form} />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onClose}
            className="hover:bg-emerald-900/20 transition-colors"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Criar Instância
          </Button>
        </div>
      </form>
    </Form>
  );
}