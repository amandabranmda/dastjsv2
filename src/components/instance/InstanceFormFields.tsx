import { Form } from "@/components/ui/form";
import { UserSelectField } from "../form/UserSelectField";
import { DeviceSelectField } from "../form/DeviceSelectField";
import { EvolutionSelectField } from "../form/EvolutionSelectField";
import { ProjectSelectField } from "../form/ProjectSelectField";
import { ChipSelect } from "../form/ChipSelect";
import { UseFormReturn } from "react-hook-form";

interface InstanceFormFieldsProps {
  form: UseFormReturn<any>;
}

export function InstanceFormFields({ form }: InstanceFormFieldsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-6">Criar Nova Instância</h2>
      
      <ChipSelect
        form={form}
        name="instanceName"
        label="Instância"
        placeholder="Selecione um número de chip"
        className="bg-[#0D2139] border-[#1E3A5F] text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EvolutionSelectField 
          form={form} 
          className="bg-[#0D2139] border-[#1E3A5F] text-white" 
        />
        <ProjectSelectField 
          form={form} 
          className="bg-[#0D2139] border-[#1E3A5F] text-white" 
        />
        <UserSelectField 
          form={form} 
          className="bg-[#0D2139] border-[#1E3A5F] text-white" 
        />
        <DeviceSelectField 
          form={form} 
          className="bg-[#0D2139] border-[#1E3A5F] text-white" 
        />
      </div>
    </div>
  );
}