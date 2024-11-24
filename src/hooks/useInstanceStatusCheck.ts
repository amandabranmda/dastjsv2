import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useInstanceStatusCheck = (instanceNumber: string | null, onSuccess: (status: string) => void) => {
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
          return;
        }

        if (!data) {
          console.error('Nenhum dado encontrado para a instância');
          return;
        }

        const currentStatus = data.statusInstancia;
        setStatus(currentStatus);
        
        // Chama onSuccess para qualquer status, não apenas para "open"
        onSuccess(currentStatus);

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