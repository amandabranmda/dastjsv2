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
})

export function CreateInstanceForm({ onClose }: { onClose: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: "",
      evolution: "",
      user: "",
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
                <Input placeholder="Digite o nome da instância" {...field} />
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