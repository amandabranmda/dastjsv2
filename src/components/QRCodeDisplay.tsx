import { Card } from "./ui/card";

interface QRCodeDisplayProps {
  base64Image: string | null;
  isLoading: boolean;
  instanceName?: string | null;
}

export function QRCodeDisplay({ base64Image, isLoading, instanceName }: QRCodeDisplayProps) {
  if (isLoading) {
    return (
      <Card className="glass-card p-6 flex items-center justify-center">
        <div className="text-sky-400">Aguardando QR Code...</div>
      </Card>
    );
  }

  if (!base64Image) {
    return null;
  }

  return (
    <Card className="glass-card p-6 flex flex-col items-center gap-4">
      {instanceName && (
        <h3 className="text-lg font-semibold text-emerald-400">
          Instância {instanceName} criada com sucesso!
        </h3>
      )}
      <h3 className="text-lg font-semibold text-sky-400">QR Code da Instância</h3>
      <div className="w-[300px] h-[300px] flex items-center justify-center bg-white p-4 rounded-lg">
        <img
          src={base64Image}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-sm text-sky-400/80">Escaneie o QR Code para conectar</p>
    </Card>
  );
}