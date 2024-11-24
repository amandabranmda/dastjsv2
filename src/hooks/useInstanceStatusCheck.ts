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

        if (error) {
          console.error('Erro ao verificar status:', error);
          toast.error('Erro ao verificar status da instância', {
            duration: 5000,
          });
          return;
        }

        if (!data) {
          console.error('Nenhum dado encontrado para a instância');
          toast.error('Instância não encontrada', {
            duration: 5000,
          });
          return;
        }

        const currentStatus = data.statusInstancia;
        setStatus(currentStatus);
        
        if (currentStatus === "open") {
          onSuccess();
          toast.success(currentStatus, {
            className: "bg-blue-500 text-white",
            duration: 5000,
          });
        } else {
          toast.success(currentStatus, {
            className: "bg-orange-500 text-white",
            duration: 5000,
          });
        }

      } catch (error) {
        console.error('Erro na verificação:', error);
        toast.error('Erro ao verificar status da instância', {
          duration: 5000,
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [instanceNumber, onSuccess]);

  return { isChecking, status };
};