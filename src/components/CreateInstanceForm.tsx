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
import { useState } from "react"
import { toast } from "sonner"
import { WebhookResponseHandler } from "./webhook/WebhookResponseHandler"
import { useInstanceStatusCheck } from "@/hooks/useInstanceStatusCheck"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [alertMessage, setAlertMessage] = useState<string | null>("Aguardando dados");
  const [alertType, setAlertType] = useState<'success' | 'warning' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showCloseAlert, setShowCloseAlert] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: "",
      evolution: "",
      user: "",
      project: "",
      device: "",
    },
  });

  const { isChecking, status: instanceStatus } = useInstanceStatusCheck(selectedChip, (currentStatus) => {
    if (currentStatus === "open") {
      setIsConnected(true);
      setAlertType('success');
    } else {
      setIsConnected(false);
      setAlertType('warning');
    }
    setQrCode(null);
    setStatus(currentStatus);
    setAlertMessage(currentStatus);
  });

  const handleCloseAttempt = () => {
    setShowCloseAlert(true);
  };

  const isBase64 = (str: string) => {
    if (str.startsWith('data:image/')) {
      const base64Data = str.split(',')[1];
      try {
        return btoa(atob(base64Data)) === base64Data;
      } catch (err) {
        return false;
      }
    }
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setIsConnected(false);
    onQRGenerationStart();
    setQrCode(null);
    setStatus(null);
    setAlertMessage("Aguardando QR Code");
    setAlertType('warning');
    
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
        setAlertMessage("Leia o QR Code");
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
          isChecking={isChecking}
          isConnected={isConnected}
          status={status}
        />

        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCloseAttempt}
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
            onClick={handleCloseAttempt}
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

        <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
          <AlertDialogContent className="bg-[#0A1A2A] border border-[#1E3A5F] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja realmente fechar?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                {isLoading 
                  ? "Você está gerando um QR Code. Se fechar agora, perderá o progresso."
                  : qrCode 
                    ? "A verificação do status da instância está em andamento. Se fechar agora, não poderá ver o resultado."
                    : "Tem certeza que deseja fechar este formulário?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setShowCloseAlert(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white border-none"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowCloseAlert(false);
                  onClose();
                }}
                className="bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Sim, fechar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
