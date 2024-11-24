import { ChipsTable } from "@/components/ChipsTable";
import { X } from "lucide-react";

interface ChipsTableSectionProps {
  selectedStatus: string;
  statusChips: any[] | undefined;
  onClose: () => void;
}

export function ChipsTableSection({ selectedStatus, statusChips, onClose }: ChipsTableSectionProps) {
  if (!statusChips) return null;

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
      
      <div className="mt-4">
        <ChipsTable 
          chips={statusChips} 
          title={selectedStatus}
          onCheckboxChange={() => {}}
          onCopyChip={() => {}}
          selectedChips={[]}
          checkedChips={[]}
        />
      </div>
    </div>
  );
}