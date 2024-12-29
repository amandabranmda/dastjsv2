import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface StatusCardHeaderProps {
  title: string;
  value: number | string;
  type: "online" | "closed" | "sending";
  responsavelChip?: string;
  onFullScreenClick: (e: React.MouseEvent) => void;
}

export function StatusCardHeader({ 
  title, 
  value, 
  type, 
  responsavelChip, 
  onFullScreenClick 
}: StatusCardHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <Button
        onClick={onFullScreenClick}
        className="absolute top-2 right-2 p-1 hover:bg-gray-200/10 rounded-full transition-colors"
      >
        <Maximize2 className="w-4 h-4 text-gray-400" />
      </Button>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${
          type === "online" ? "bg-[#10B981]" :
          type === "closed" && title.includes("Aguardando Desbloqueio") ? "bg-[#F97316]" : "bg-[#0EA5E9]"
        }`} />
        <h3 className="text-xs sm:text-sm text-gray-400 font-medium">{title}</h3>
      </div>
      <div className="flex flex-col items-start">
        <p className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">{value}</p>
        {responsavelChip && (
          <p className="text-sm text-gray-400 mt-2">Responsável: {responsavelChip}</p>
        )}
      </div>
    </div>
  );
}