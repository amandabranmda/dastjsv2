import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useInstanceStatusCheck = (instanceNumber: string | null, onSuccess: () => void) => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!instanceNumber) return;

    const checkStatus = async () => {
      setIsChecking(true);
      console.log('Iniciando verificação para instância:', instanceNumber);
      
      // Aguarda 30 segundos
      await new Promise(resolve => setTimeout(resolve, 30000));
      console.log('30 segundos passados, verificando status...');

      try {
        const { data, error } = await supabase
          .from("1-chipsInstancias")
          .select("statusInstancia")
          .eq("numeroChip", instanceNumber)
          .single();

        console.log('Resultado da verificação:', data);

        if (error) {
          console.error('Erro ao verificar status:', error);
          return;
        }

        const currentStatus = data?.statusInstancia;
        setStatus(currentStatus);
        
        if (currentStatus === "open") {
          onSuccess();
        }

        toast.success(currentStatus, {
          className: currentStatus === "open" ? "bg-blue-500" : "bg-orange-500",
          duration: 5000,
        });

      } catch (error) {
        console.error('Erro na verificação:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [instanceNumber, onSuccess]);

  return { isChecking, status };
};