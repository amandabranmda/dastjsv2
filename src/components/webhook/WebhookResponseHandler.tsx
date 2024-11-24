import { QRCodeDisplay } from "../QRCodeDisplay";
import { InstanceStatusAlert } from "../status/InstanceStatusAlert";

interface WebhookResponseHandlerProps {
  qrCode: string | null;
  alertMessage: string | null;
  alertType: 'success' | 'warning' | 'error' | null;
  instanceName: string | null;
  isLoading: boolean;
}

export function WebhookResponseHandler({
  qrCode,
  alertMessage,
  alertType,
  instanceName,
  isLoading
}: WebhookResponseHandlerProps) {
  return (
    <>
      <InstanceStatusAlert message={alertMessage} type={alertType} />
      
      {qrCode && (
        <div className="mt-6">
          <QRCodeDisplay 
            base64Image={qrCode}
            isLoading={isLoading}
            isChecking={false}
            instanceName={instanceName}
          />
        </div>
      )}
    </>
  );
}