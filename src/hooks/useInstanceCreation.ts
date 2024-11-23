import { useState } from "react";
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

  const createInstance = async (values: CreateInstancePayload) => {
    setIsLoading(true);
    onQRGenerationStart();

    try {
      const data = await instanceApi.createInstance(values);
      
      setQrCode(data.qrcode);
      setInstanceName(data.instancia);
      toast.success(`Instância ${data.instancia} criada com sucesso!`);
      
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
    instanceName,
    createInstance,
    checkInstanceStatus
  };
};