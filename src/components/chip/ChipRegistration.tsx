import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ChipRegistrationFormFields } from "../form/ChipRegistrationFormFields";

interface ChipRegistrationProps {
  formData: {
    numeroChip: string;
    localChip: string;
    statusChip: string;
    responsavelChip: string;
  };
  setFormData: (data: any) => void;
  searchNumber: string;
  onSuccess: () => void;
}

export function ChipRegistration({ formData, setFormData, searchNumber, onSuccess }: ChipRegistrationProps) {
  const handleRegister = async () => {
    if (!formData.numeroChip || !formData.localChip || !formData.statusChip) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .insert([formData]);

      if (error) throw error;

      toast.success("Chip cadastrado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao cadastrar chip:", error);
      toast.error("Erro ao cadastrar chip");
    }
  };

  return (
    <ChipRegistrationFormFields
      formData={formData}
      setFormData={setFormData}
      onRegister={handleRegister}
      searchNumber={searchNumber}
    />
  );
}