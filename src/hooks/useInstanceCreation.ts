import { useState } from "react";
import { instanceApi } from "@/services/instanceApi";
import { toast } from "sonner";

export interface UseInstanceCreationProps {
  onQRGenerationStart: () => void;
  onQRGenerationEnd: () => void;
  onConnectionSuccess?: () => void;
  onConnectionError?: () => void;
}

export interface CreateInstancePayload {
  instanceName: string;
  evolution: string;
  user: string;
  project: string;
  device: string;
}

export const useInstanceCreation = ({
  onQRGenerationStart,
  onQRGenerationEnd,
  onConnectionSuccess,
  onConnectionError
}: UseInstanceCreationProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [instanceName, setInstanceName] = useState<string | null>(null);

  const createInstance = async (values: CreateInstancePayload) => {
    setIsLoading(true);
    onQRGenerationStart();

    try {
      const data = await instanceApi.createInstance(values);
      setQrCode(data.qrcode);
      setInstanceName(data.instancia);

      // Simula verificação de conexão após 40 segundos
      setTimeout(() => {
        setIsChecking(true);
        // Simula sucesso ou falha aleatoriamente para teste
        const isSuccess = Math.random() > 0.5;
        
        if (isSuccess) {
          onConnectionSuccess?.();
        } else {
          onConnectionError?.();
        }
        
        setIsChecking(false);
      }, 40000);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao criar instância: ${errorMessage}`);
      setQrCode(null);
      setInstanceName(null);
      return null;
    } finally {
      setIsLoading(false);
      onQRGenerationEnd();
    }
  };

  return {
    qrCode,
    isLoading,
    isChecking,
    instanceName,
    createInstance
  };
};