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
    <Card className="glass-card p-6 space-y-4">
      <div className="flex flex-col items-center gap-2">
        {instanceName && (
          <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-full">
            <span className="text-lg font-semibold text-emerald-400">
              Instância {instanceName} criada com sucesso!
            </span>
          </div>
        )}
        <div className="text-center p-3 bg-sky-500/10 border border-sky-500/20 rounded-lg w-full">
          <span className="text-lg font-semibold text-sky-400">
            QR Code da Instância
          </span>
        </div>
      </div>

      <div className="w-[300px] h-[300px] mx-auto flex items-center justify-center bg-white p-4 rounded-lg">
        <img
          src={base64Image}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      </div>
      
      <p className="text-sm text-sky-400/80 text-center">
        Escaneie o QR Code para conectar
      </p>
    </Card>
  );
}