import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

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
});

export type FormValues = z.infer<typeof formSchema>;

interface UseInstanceFormProps {
  onQRGenerationStart: () => void;
  onQRGenerationEnd: () => void;
  setQrCode: (qrCode: string | null) => void;
  setSelectedChip: (chip: string | null) => void;
  setAlertMessage: (message: string) => void;
  setAlertType: (type: 'success' | 'warning' | 'error' | null) => void;
}

export function useInstanceForm({
  onQRGenerationStart,
  onQRGenerationEnd,
  setQrCode,
  setSelectedChip,
  setAlertMessage,
  setAlertType,
}: UseInstanceFormProps) {
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

  const onSubmit = async (values: FormValues) => {
    onQRGenerationStart();
    setQrCode(null);
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
        const errorMessage = data.message || "Erro ao gerar QR Code";
        setAlertMessage(errorMessage);
        setAlertType('error');
        toast.error(errorMessage, {
          duration: 5000,
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao conectar com o servidor. Por favor, tente novamente.';
      
      console.error("Error creating instance:", error);
      setAlertMessage(errorMessage);
      setAlertType('error');
      setQrCode(null);
      
      toast.error(errorMessage, {
        duration: 5000,
        className: "bg-red-500 text-white border-red-600",
      });
    } finally {
      onQRGenerationEnd();
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}