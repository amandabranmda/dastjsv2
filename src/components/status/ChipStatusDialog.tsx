import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChipsTable } from "../ChipsTable";
import { cn } from "@/lib/utils";

interface ChipStatusDialogProps {
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

export function ChipStatusDialog({
  isOpen,
  title,
  chips,
  selectedChips,
  checkedChips,
  onCopyChip,
  onCheckboxChange,
  refetchData,
  isFullScreen,
}: ChipStatusDialogProps) {
  const dialogTitle = title.includes("verificarDesconexao") 
    ? "Chips Desconectados" 
    : title.includes("Chips Liberados")
    ? "Chips Liberados"
    : "Chips Aguardando Desbloqueio";

  return (
    <DialogContent className={cn(
      "w-[95vw] sm:max-w-[600px]",
      "max-h-[90vh] sm:max-h-[80vh]",
      isFullScreen && "!w-[95vw] !h-[95vh]"
    )}>
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>
          Lista de chips com status {dialogTitle.toLowerCase()}
        </DialogDescription>
      </DialogHeader>
      <div className={cn(
        "overflow-y-auto",
        isFullScreen ? "max-h-[80vh]" : "max-h-[60vh] sm:max-h-[400px]"
      )}>
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