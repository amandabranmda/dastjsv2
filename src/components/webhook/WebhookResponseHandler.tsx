import { QRCodeDisplay } from "../QRCodeDisplay";
import { InstanceStatusAlert } from "../status/InstanceStatusAlert";

interface WebhookResponseHandlerProps {
  qrCode: string | null;
  alertMessage: string | null;
  alertType: 'success' | 'warning' | 'error' | null;
  instanceName: string | null;
  isLoading: boolean;
  isChecking?: boolean;
  isConnected?: boolean;
}

export function WebhookResponseHandler({
  qrCode,
  alertMessage,
  alertType,
  instanceName,
  isLoading,
  isChecking,
  isConnected
}: WebhookResponseHandlerProps) {
  const finalAlertType = isConnected ? 'success' : alertType;
  const finalMessage = isConnected ? "Instância Conectada com Sucesso!" : alertMessage;

  return (
    <>
      <InstanceStatusAlert 
        message={finalMessage} 
        type={finalAlertType} 
      />
      
      {!isConnected && qrCode && (
        <div className="mt-6">
          <QRCodeDisplay 
            base64Image={qrCode}
            isLoading={isLoading}
            isChecking={isChecking}
            instanceName={instanceName}
          />
        </div>
      )}
    </>
  );
}