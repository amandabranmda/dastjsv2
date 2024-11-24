import { Button } from "@/components/ui/button";
import { ChipsTable } from "@/components/ChipsTable";

interface ChipsTableSectionProps {
  selectedStatus: string | null;
  statusChips: any[] | null;
  onClose: () => void;
}

export function ChipsTableSection({ selectedStatus, statusChips, onClose }: ChipsTableSectionProps) {
  if (!selectedStatus || !statusChips) return null;

  return (
    <div className="mt-6 bg-black/50 p-6 rounded-lg backdrop-blur-sm border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">
          Chips com status: {selectedStatus}
        </h2>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          Fechar
        </Button>
      </div>
      <ChipsTable
        chips={statusChips}
        title={selectedStatus}
        onCheckboxChange={() => {}}
        onCopyChip={() => {}}
        selectedChips={[]}
        checkedChips={[]}
      />
    </div>
  );
}