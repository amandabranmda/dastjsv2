import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Maximize2, Minimize2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface QRCodeDisplayProps {
  base64Image: string | null;
  isLoading: boolean;
  isChecking?: boolean;
  instanceName?: string | null;
}

export function QRCodeDisplay({ 
  base64Image, 
  isLoading, 
  isChecking,
  instanceName
}: QRCodeDisplayProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const element = document.getElementById('qr-container');
        if (element) {
          await element.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Erro ao alternar tela cheia:", err);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#0A1A2A]/90 backdrop-blur-md border border-sky-500/20 p-4 sm:p-6 flex items-center justify-center animate-pulse">
        <div className="text-sky-400">Aguardando QR Code...</div>
      </Card>
    );
  }

  if (!base64Image) {
    return null;
  }

  return (
    <Card 
      id="qr-container"
      className={`relative bg-[#0A1A2A]/90 backdrop-blur-md border border-sky-500/20 p-6 flex flex-col items-center gap-6 mx-auto transition-all duration-300 ${
        isFullScreen 
          ? 'fixed inset-0 w-full h-full z-50 flex items-center justify-center m-0 rounded-none'
          : 'w-[95%] max-w-[400px] rounded-xl'
      }`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullScreen}
          className="text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
        >
          {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-sky-400 hover:text-sky-300 hover:bg-sky-400/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {instanceName && (
        <div className="text-center space-y-1">
          <h3 className="text-lg font-medium text-emerald-400">
            Instância {instanceName}
          </h3>
          <p className="text-emerald-400/80 text-sm">
            criada com sucesso!
          </p>
        </div>
      )}

      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium text-sky-400">QR Code da Instância</h3>
      </div>
      
      <div className={`bg-white p-4 rounded-xl shadow-lg ${
        isFullScreen ? 'w-auto h-[80vh] aspect-square' : 'w-full aspect-square max-w-[280px]'
      }`}>
        <img
          src={base64Image}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      </div>
      
      <p className="text-sm text-sky-400/80">
        {isChecking 
          ? "Verificando conexão da instância..." 
          : "Escaneie o QR Code para conectar"}
      </p>

      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-emerald-400 blur-3xl" />
      </div>
    </Card>
  );
}