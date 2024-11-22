import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface StatusResultCardProps {
  status: string;
  onClose: () => void;
}

export function StatusResultCard({ status, onClose }: StatusResultCardProps) {
  return (
    <Card className="fixed bottom-4 right-4 p-6 bg-gradient-to-br from-sky-900/90 to-sky-800/90 backdrop-blur-sm border border-sky-600/20 text-white animate-slide-up">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Status da Instância</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sky-400 hover:text-sky-300 hover:bg-sky-950/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sky-200">{status}</p>
      </div>
    </Card>
  );
}