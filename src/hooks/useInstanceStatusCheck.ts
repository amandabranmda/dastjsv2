import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useInstanceStatusCheck = (instanceNumber: string | null, onSuccess: () => void) => {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!instanceNumber) return;

    const checkStatus = async () => {
      setIsChecking(true);
      
      // Wait 30 seconds before checking
      await new Promise(resolve => setTimeout(resolve, 30000));

      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("statusInstancia")
        .eq("numeroChip", instanceNumber)
        .single();

      if (!error && data?.statusInstancia === "open") {
        onSuccess();
      }
      
      setIsChecking(false);
    };

    checkStatus();
  }, [instanceNumber, onSuccess]);

  return { isChecking };
};