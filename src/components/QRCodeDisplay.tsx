import { Card } from "./ui/card";

interface QRCodeDisplayProps {
  base64Image: string | null;
  isLoading: boolean;
  instanceName?: string | null;
}

export function QRCodeDisplay({ base64Image, isLoading, instanceName }: QRCodeDisplayProps) {
  if (isLoading) {
    return (
      <Card className="glass-card p-4 sm:p-6 flex items-center justify-center">
        <div className="text-sky-400">Aguardando QR Code...</div>
      </Card>
    );
  }

  if (!base64Image) {
    return null;
  }

  return (
    <Card className="glass-card p-4 sm:p-6 flex flex-col items-center gap-4 w-full max-w-[90vw] sm:max-w-md mx-auto">
      {instanceName && (
        <h3 className="text-base sm:text-lg font-semibold text-emerald-400 text-center">
          Instância {instanceName} criada com sucesso!
        </h3>
      )}
      <h3 className="text-base sm:text-lg font-semibold text-sky-400">QR Code da Instância</h3>
      <div className="w-full aspect-square max-w-[280px] sm:max-w-[300px] flex items-center justify-center bg-white p-2 sm:p-4 rounded-lg">
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