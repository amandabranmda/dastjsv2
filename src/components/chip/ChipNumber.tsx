import { Copy } from "lucide-react";

interface ChipNumberProps {
  numeroChip: string;
  onCopy: () => void;
}

export function ChipNumber({ numeroChip, onCopy }: ChipNumberProps) {
  return (
    <div 
      className="flex items-center gap-2 group cursor-pointer"
      onClick={onCopy}
    >
      <p className="text-white font-medium group-hover:text-sky-400 transition-colors">
        {numeroChip || '-'}
      </p>
      <Copy className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" />
    </div>
  );
}