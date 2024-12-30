import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ChipNumberProps {
  numeroChip: string;
}

export function ChipNumber({ numeroChip }: ChipNumberProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyChip = async () => {
    try {
      await navigator.clipboard.writeText(numeroChip);
      setCopied(true);
      toast.success("Número do chip copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar número:", error);
      toast.error("Erro ao copiar número do chip");
    }
  };

  return (
    <div 
      className="flex items-center gap-2 group cursor-pointer"
      onClick={handleCopyChip}
    >
      <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
        {numeroChip}
      </p>
      {copied ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
      )}
    </div>
  );
}