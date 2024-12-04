import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusResultCardProps {
  status: string;
  onClose: () => void;
}

export function StatusResultCard({ status, onClose }: StatusResultCardProps) {
  const isOpen = status.toLowerCase() === 'open';
  
  return (
    <Card className={cn(
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
      "w-[90vw] max-w-md p-6",
      "flex flex-col items-center justify-center",
      "backdrop-blur-sm border shadow-lg",
      isOpen 
        ? "bg-emerald-500/90 border-emerald-400/20" 
        : "bg-orange-500/90 border-orange-400/20",
      "text-white animate-fade-in-scale"
    )}>
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center gap-4 text-center">
        <h3 className="text-xl font-semibold">Status da Instância</h3>
        <p className="text-lg font-medium">{status}</p>
      </div>
    </Card>
  );
}