import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { WebhookResponseHandler } from "./webhook/WebhookResponseHandler"
import { useInstanceStatusCheck } from "@/hooks/useInstanceStatusCheck"
import { CloseConfirmationDialog } from "./dialogs/CloseConfirmationDialog"
import { InstanceFormFields } from "./forms/InstanceFormFields"

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
    <>
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

      <InstanceFormFields
        form={form}
        onClose={handleCloseAttempt}
        isLoading={isLoading}
      />

      <CloseConfirmationDialog
        isOpen={showCloseAlert}
        onOpenChange={setShowCloseAlert}
        onConfirm={() => {
          setShowCloseAlert(false);
          onClose();
        }}
        isLoading={isLoading}
        hasQRCode={!!qrCode}
      />
    </>
  );
}