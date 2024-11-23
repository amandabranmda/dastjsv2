import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { UserSelectField } from "./form/UserSelectField"
import { ChipSelectItem } from "./form/ChipSelectItem"
import { CustomFormField } from "./form/FormField"
import { DeviceSelectField } from "./form/DeviceSelectField"
import { EvolutionSelectField } from "./form/EvolutionSelectField"
import { ProjectSelectField } from "./form/ProjectSelectField"
import { QRCodeDisplay } from "./QRCodeDisplay"
import { StatusResultCard } from "./StatusResultCard"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

const formSchema = z.object({
  instanceName: z.string().min(2, {
    message: "Nome da instância deve ter pelo menos 2 caracteres.",
  }),
  evolution: z.string().min(2, {
    message: "Evolution deve ter pelo menos 2 caracteres.",
  }),
  user: z.string().min(2, {
    message: "Usuário deve ter pelo menos 2 caracteres.",
  }),
  project: z.string().min(2, {
    message: "Projeto deve ter pelo menos 2 caracteres.",
  }),
  device: z.string().min(2, {
    message: "Dispositivo deve ser selecionado.",
  }),
})

export function CreateInstanceForm({ 
  onClose, 
  onQRGenerationStart, 
  onQRGenerationEnd,
  onStatusCheckComplete 
}: { 
  onClose: () => void;
  onQRGenerationStart: () => void;
  onQRGenerationEnd: () => void;
  onStatusCheckComplete: () => void;
}) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [shouldCheckStatus, setShouldCheckStatus] = useState(false);
  const [showStatusCard, setShowStatusCard] = useState(false);
  const [instanceStatus, setInstanceStatus] = useState<string | null>(null);

  const { data: chipStatus, refetch: refetchChipStatus } = useQuery({
    queryKey: ["chip-status", selectedChip],
    queryFn: async () => {
      if (!selectedChip) return null;
      
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("statusInstancia")
        .eq("numeroChip", selectedChip)
        .single();

      if (error) throw error;
      return data?.statusInstancia;
    },
    enabled: shouldCheckStatus,
    refetchInterval: false,
  });

  useEffect(() => {
    if (shouldCheckStatus) {
      const timer = setTimeout(() => {
        refetchChipStatus().then((result) => {
          if (result.data) {
            setInstanceStatus(result.data);
            setShowStatusCard(true);
          }
          setShouldCheckStatus(false);
          onStatusCheckComplete();
        });
      }, 30000); // Changed from 20000 to 30000 (30 seconds)

      return () => clearTimeout(timer);
    }
  }, [shouldCheckStatus, refetchChipStatus, onStatusCheckComplete]);

  const { data: releasedChips } = useQuery({
    queryKey: ["released-chips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip")
        .eq("statusChip", "liberado");

      if (error) throw error;
      return data;
    }
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instanceName: "",
      evolution: "",
      user: "",
      project: "",
      device: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      onQRGenerationStart();
      const response = await fetch('https://ct103n8nwebhook.wpp-app.com/webhook/qrDast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Falha ao criar instância');

      const data = await response.json();
      
      if (data.qrcode) {
        setQrCode(data.qrcode);
        setInstanceName(data.instancia);
        setSelectedChip(values.instanceName);
        setShouldCheckStatus(true);
        toast.success(`Instância ${data.instancia} criada com sucesso!`);
      } else {
        throw new Error('QR Code não recebido');
      }
    } catch (error) {
      toast.error("Erro ao criar instância. Tente novamente.");
      setQrCode(null);
      setInstanceName(null);
    } finally {
      setIsLoading(false);
      onQRGenerationEnd();
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
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
          
          <CustomFormField
            form={form}
            name="instanceName"
            label="Nome Instância"
            placeholder="Selecione um número de chip"
            releasedChips={releasedChips}
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

        {(isLoading || qrCode) && (
          <div className="mt-6">
            <QRCodeDisplay 
              base64Image={qrCode} 
              isLoading={isLoading}
              instanceName={instanceName}
              isCheckingStatus={shouldCheckStatus}
            />
          </div>
        )}

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

      {showStatusCard && instanceStatus && (
        <StatusResultCard 
          status={instanceStatus} 
          onClose={() => setShowStatusCard(false)} 
        />
      )}
    </Form>
  );
}
