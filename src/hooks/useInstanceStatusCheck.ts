import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useInstanceStatusCheck = (instanceNumber: string | null, onSuccess: () => void) => {
  const [isChecking, setIsChecking] = useState(false);

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

        if (data?.statusInstancia === "open") {
          console.log('Status é open, chamando onSuccess');
          onSuccess();
        }
      } catch (error) {
        console.error('Erro na verificação:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [instanceNumber, onSuccess]);

  return { isChecking };
};