import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

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
        .select("numeroChip")
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
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Here you would add your webhook URL
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
        <FormField
          control={form.control}
          name="instanceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Instância</FormLabel>
              <FormControl>
                {!showCustomInstance ? (
                  <Select 
                    onValueChange={(value) => {
                      if (value === "custom") {
                        setShowCustomInstance(true);
                        field.onChange("");
                      } else {
                        field.onChange(value);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um número de chip" />
                    </SelectTrigger>
                    <SelectContent>
                      {releasedChips?.map((chip) => (
                        <SelectItem key={chip.numeroChip} value={chip.numeroChip}>
                          {chip.numeroChip}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Digitar manualmente</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input 
                      placeholder="Digite o nome da instância" 
                      {...field}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="evolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evolution</FormLabel>
              <FormControl>
                <Input placeholder="Digite o evolution" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário</FormLabel>
              <FormControl>
                <Input placeholder="Digite o usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projeto</FormLabel>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
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
                      {...field}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Criar Instância</Button>
        </div>
      </form>
    </Form>
  )
}