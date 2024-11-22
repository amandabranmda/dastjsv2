import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { UserSelectField } from "./form/UserSelectField"
import { ChipSelectItem } from "./form/ChipSelectItem"
import { CustomFormField } from "./form/FormField"
import { DeviceSelectField } from "./form/DeviceSelectField"
import { EvolutionSelectField } from "./form/EvolutionSelectField"
import { ProjectSelectField } from "./form/ProjectSelectField"

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

export function CreateInstanceForm({ onClose }: { onClose: () => void }) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gradient-to-br from-sky-900/20 to-sky-800/10 p-6 rounded-xl backdrop-blur-sm">
        <div className="space-y-6">
          <CustomFormField
            form={form}
            name="instanceName"
            label="Nome Instância"
            placeholder="Selecione um número de chip"
            releasedChips={releasedChips}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EvolutionSelectField form={form} />
            <ProjectSelectField form={form} />
            <UserSelectField form={form} />
            <DeviceSelectField form={form} />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-sky-600/20">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onClose}
            className="bg-transparent border-sky-600/30 text-sky-50 hover:bg-sky-900/20 transition-colors"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white transition-colors"
          >
            Criar Instância
          </Button>
        </div>
      </form>
    </Form>
  );
}