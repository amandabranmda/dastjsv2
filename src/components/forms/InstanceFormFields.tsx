import { Form } from "@/components/ui/form"
import { UserSelectField } from "../form/UserSelectField"
import { DeviceSelectField } from "../form/DeviceSelectField"
import { EvolutionSelectField } from "../form/EvolutionSelectField"
import { ProjectSelectField } from "../form/ProjectSelectField"
import { ChipSelect } from "../form/ChipSelect"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

interface InstanceFormFieldsProps {
  form: UseFormReturn<any>;
  onClose: () => void;
  isLoading: boolean;
}

export function InstanceFormFields({ form, onClose, isLoading }: InstanceFormFieldsProps) {
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => {
          if (form.handleSubmit) {
            form.handleSubmit(data);
          }
        })}
        className="relative space-y-6 rounded-xl bg-[#0A1A2A] p-6 border border-[#1E3A5F]"
      >
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

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

        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
          >
            {isLoading ? "Criando..." : "Criar Instância"}
          </Button>
        </div>
      </form>
    </Form>
  );
}