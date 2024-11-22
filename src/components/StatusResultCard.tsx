import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface StatusResultCardProps {
  status: string;
  onClose: () => void;
}

export function StatusResultCard({ status, onClose }: StatusResultCardProps) {
  return (
    <Card className="fixed bottom-4 right-4 p-6 bg-gradient-to-br from-sky-900/90 to-sky-800/80 backdrop-blur-sm border border-sky-600/20 text-white shadow-xl animate-fade-in-scale">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-medium">Status da Instância</h3>
        </div>
        <p className="text-sky-200">{status}</p>
        <Button 
          onClick={onClose}
          className="bg-sky-600 hover:bg-sky-700 text-white transition-colors"
        >
          Fechar
        </Button>
      </div>
    </Card>
  );
}