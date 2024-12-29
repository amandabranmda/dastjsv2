import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { X } from "lucide-react";
import { useState } from "react";
import { WebhookResponseHandler } from "./webhook/WebhookResponseHandler";
import { useInstanceStatusCheck } from "@/hooks/useInstanceStatusCheck";
import { InstanceFormFields } from "./instance/InstanceFormFields";
import { CloseAlertDialog } from "./instance/CloseAlertDialog";
import { useInstanceForm } from "@/hooks/useInstanceForm";

export function CreateInstanceForm({ 
  onClose, 
  onQRGenerationStart, 
  onQRGenerationEnd
}: { 
  onClose: () => void;
  onQRGenerationStart: () => void;
  onQRGenerationEnd: () => void;
}) {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>("Aguardando dados");
  const [alertType, setAlertType] = useState<'success' | 'warning' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showCloseAlert, setShowCloseAlert] = useState(false);

  const { isChecking, status } = useInstanceStatusCheck(selectedChip, (currentStatus) => {
    if (currentStatus === "open") {
      setAlertType('success');
    } else {
      setAlertType('warning');
    }
    setQrCode(null);
    setAlertMessage(currentStatus);
  });

  const { form, onSubmit } = useInstanceForm({
    onQRGenerationStart: () => {
      setIsLoading(true);
      onQRGenerationStart();
    },
    onQRGenerationEnd: () => {
      setIsLoading(false);
      onQRGenerationEnd();
    },
    setQrCode,
    setSelectedChip,
    setAlertMessage,
    setAlertType,
  });

  return (
    <Form {...form}>
      <form 
        onSubmit={onSubmit} 
        className="relative space-y-6 rounded-xl bg-[#0A1A2A] p-6 border border-[#1E3A5F]"
      >
        <WebhookResponseHandler
          qrCode={qrCode}
          alertMessage={alertMessage}
          alertType={alertType}
          instanceName={selectedChip}
          isLoading={isLoading}
          isChecking={isChecking}
          isConnected={status === "open"}
          status={status}
        />

        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowCloseAlert(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <InstanceFormFields form={form} />

        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            onClick={() => setShowCloseAlert(true)}
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

        <CloseAlertDialog
          isOpen={showCloseAlert}
          onOpenChange={setShowCloseAlert}
          isLoading={isLoading}
          hasQRCode={!!qrCode}
          onClose={onClose}
        />
      </form>
    </Form>
  );
}