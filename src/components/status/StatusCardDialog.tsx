import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChipsTable } from "../ChipsTable";

interface StatusCardDialogProps {
  isOpen: boolean;
  title: string;
  chips: any[];
  selectedChips: string[];
  checkedChips: string[];
  onCopyChip: (chipNumber: string) => void;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  refetchData: () => void;
  isFullScreen: boolean;
}

export function StatusCardDialog({
  isOpen,
  title,
  chips,
  selectedChips,
  checkedChips,
  onCopyChip,
  onCheckboxChange,
  refetchData,
  isFullScreen,
}: StatusCardDialogProps) {
  const dialogTitle = title.includes("verificarDesconexao") 
    ? "Chips Desconectados" 
    : title.includes("Chips Liberados")
    ? "Chips Liberados"
    : "Chips Aguardando Desbloqueio";

  return (
    <DialogContent className={`
      w-[95vw] sm:max-w-[600px]
      max-h-[90vh] sm:max-h-[80vh]
      ${isFullScreen ? "!w-[95vw] !h-[95vh]" : ""}
    `}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{dialogTitle}</h2>
        <p className="text-sm text-gray-400">
          Lista de chips com status {dialogTitle.toLowerCase()}
        </p>
      </div>
      <div className={`
        overflow-y-auto
        ${isFullScreen ? "max-h-[80vh]" : "max-h-[60vh] sm:max-h-[400px]"}
      `}>
        <ChipsTable
          chips={chips || []}
          title={title}
          onCheckboxChange={onCheckboxChange}
          onCopyChip={onCopyChip}
          selectedChips={selectedChips}
          checkedChips={checkedChips}
          refetchData={refetchData}
        />
      </div>
    </DialogContent>
  );
}