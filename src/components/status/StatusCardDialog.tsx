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
      w-[95vw] sm:max-w-[900px]
      max-h-[90vh] sm:max-h-[80vh]
      bg-[#111827]/95 backdrop-blur-md border border-sky-600/20
      p-2 sm:p-4
      ${isFullScreen ? "!w-[95vw] !h-[95vh]" : ""}
    `}>
      <div className="space-y-4 sm:space-y-6">
        <div className="border-b border-gray-700 pb-4">
          <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {dialogTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Lista de chips com status {dialogTitle.toLowerCase()}
          </p>
        </div>

        <div className={`
          overflow-y-auto
          ${isFullScreen ? "max-h-[80vh]" : "max-h-[60vh] sm:max-h-[500px]"}
          scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
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
      </div>
    </DialogContent>
  );
}