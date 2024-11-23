import { useState, useEffect } from "react";
import { instanceApi, CreateInstancePayload } from "@/services/instanceApi";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UseInstanceCreationProps {
  onQRGenerationStart: () => void;
  onQRGenerationEnd: () => void;
}

export const useInstanceCreation = ({ 
  onQRGenerationStart, 
  onQRGenerationEnd 
}: UseInstanceCreationProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const checkInstanceStatus = async (numeroChip: string) => {
    try {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("statusInstancia")
        .eq("numeroChip", numeroChip)
        .single();

      if (error) {
        console.error("Erro ao verificar status:", error);
        return false;
      }

      return data?.statusInstancia === "open";
    } catch (error) {
      console.error("Erro na consulta:", error);
      return false;
    }
  };

  const startStatusCheck = (numeroChip: string) => {
    // Aguarda 40 segundos antes de iniciar as verificações
    const timeout = setTimeout(() => {
      setIsChecking(true);
      
      const id = setInterval(async () => {
        const isConnected = await checkInstanceStatus(numeroChip);
        
        if (isConnected) {
          toast.success("Instância conectada com sucesso!");
          clearInterval(id);
          setIsChecking(false);
          setIntervalId(null);
        }
      }, 5000); // Verifica a cada 5 segundos
      
      setIntervalId(id);

      // Timeout de 2 minutos para parar as verificações
      setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
          setIsChecking(false);
          toast.error("Tempo limite de verificação excedido");
        }
      }, 120000); // 2 minutos
    }, 40000); // 40 segundos

    // Retorna a função de cleanup
    return () => {
      clearTimeout(timeout);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsChecking(false);
    };
  };

  const createInstance = async (values: CreateInstancePayload) => {
    setIsLoading(true);
    onQRGenerationStart();

    try {
      const data = await instanceApi.createInstance(values);
      
      setQrCode(data.qrcode);
      setInstanceName(data.instancia);
      toast.success(`Instância ${data.instancia} criada com sucesso!`);
      
      // Inicia a verificação de status após criar a instância
      startStatusCheck(values.instanceName);
      
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

  // Cleanup quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    qrCode,
    isLoading,
    isChecking,
    instanceName,
    createInstance,
    checkInstanceStatus
  };
};