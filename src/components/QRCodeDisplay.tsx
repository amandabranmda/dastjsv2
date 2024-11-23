import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
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
      <Card className="glass-card p-4 sm:p-6 flex items-center justify-center">
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
      className={`glass-card p-4 sm:p-6 flex flex-col items-center gap-4 mx-auto relative ${
        isFullScreen 
          ? 'fixed inset-0 w-full h-full z-50 flex items-center justify-center m-0 rounded-none'
          : 'w-[95%] max-w-[350px]'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullScreen}
        className="absolute top-2 right-2 text-sky-400 hover:text-sky-300"
      >
        {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>

      {instanceName && (
        <h3 className="text-base sm:text-lg font-semibold text-emerald-400 text-center">
          Instância {instanceName} criada com sucesso!
        </h3>
      )}

      <h3 className="text-base sm:text-lg font-semibold text-sky-400">QR Code da Instância</h3>
      
      <div className={`flex items-center justify-center bg-white p-2 sm:p-4 rounded-lg ${
        isFullScreen ? 'w-auto h-[80vh] aspect-square' : 'w-full aspect-square max-w-[250px] sm:max-w-[280px]'
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
    </Card>
  );
}