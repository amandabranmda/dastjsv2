import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UserSelectField } from "./form/UserSelectField"
import { DeviceSelectField } from "./form/DeviceSelectField"
import { EvolutionSelectField } from "./form/EvolutionSelectField"
import { ProjectSelectField } from "./form/ProjectSelectField"
import { X } from "lucide-react"
import { ChipSelect } from "./form/ChipSelect"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "sonner"
import { WebhookResponseHandler } from "./webhook/WebhookResponseHandler"

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

type FormValues = z.infer<typeof formSchema>;

export function CreateInstanceForm({ 
  onClose, 
  onQRGenerationStart, 
  onQRGenerationEnd
}: { 
  onClose: () => void;
  onQRGenerationStart: () => void;
  onQRGenerationEnd: () => void;
}) {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'warning' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: "",
      evolution: "",
      user: "",
      project: "",
      device: "",
    },
  })

  // Função auxiliar para verificar se uma string é base64 ou data URL com base64
  const isBase64 = (str: string) => {
    // Verifica se é uma data URL de imagem
    if (str.startsWith('data:image/')) {
      // Extrai apenas a parte base64 após a vírgula
      const base64Data = str.split(',')[1];
      try {
        return btoa(atob(base64Data)) === base64Data;
      } catch (err) {
        return false;
      }
    }
    // Verifica se é base64 puro
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    onQRGenerationStart();
    setQrCode(null);
    
    try {
      const response = await fetch('https://n8n-hot.wpp-app.com/webhook/qrDast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Falha na requisição');
      }

      const data = await response.json();
      
      if (data.qrcode && isBase64(data.qrcode)) {
        setQrCode(data.qrcode);
        setSelectedChip(data.instancia || values.instanceName);
        setAlertMessage("Instância Criada com sucesso!");
        setAlertType('warning');
        toast.success("Instância criada com sucesso!", {
          duration: 5000,
          className: "bg-emerald-500 text-white border-emerald-600",
        });
      } else {
        setAlertMessage(data.message || "Erro desconhecido na resposta");
        setAlertType('error');
        toast.error(data.message || "Erro desconhecido na resposta", {
          duration: 5000,
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setAlertMessage(errorMessage);
      setAlertType('error');
      setQrCode(null);
      toast.error(errorMessage, {
        duration: 5000,
        className: "bg-red-500 text-white border-red-600",
      });
    } finally {
      setIsLoading(false);
      onQRGenerationEnd();
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="relative space-y-6 rounded-xl bg-[#0A1A2A] p-6 border border-[#1E3A5F]"
      >
        <WebhookResponseHandler
          qrCode={qrCode}
          alertMessage={alertMessage}
          alertType={alertType}
          instanceName={selectedChip}
          isLoading={isLoading}
        />

        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-6">Criar Nova Instância</h2>
          
          <ChipSelect
            form={form}
            name="instanceName"
            label="Instância"
            placeholder="Selecione um número de chip"
            className="bg-[#0D2139] border-[#1E3A5F] text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EvolutionSelectField 
              form={form} 
              className="bg-[#0D2139] border-[#1E3A5F] text-white" 
            />
            <ProjectSelectField 
              form={form} 
              className="bg-[#0D2139] border-[#1E3A5F] text-white" 
            />
            <UserSelectField 
              form={form} 
              className="bg-[#0D2139] border-[#1E3A5F] text-white" 
            />
            <DeviceSelectField 
              form={form} 
              className="bg-[#0D2139] border-[#1E3A5F] text-white" 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
          >
            {isLoading ? "Criando..." : "Criar Instância"}
          </Button>
        </div>
      </form>
    </Form>
  );
}