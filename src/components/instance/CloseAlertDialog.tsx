import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CloseAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  hasQRCode: boolean;
  onClose: () => void;
}

export function CloseAlertDialog({
  isOpen,
  onOpenChange,
  isLoading,
  hasQRCode,
  onClose,
}: CloseAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#0A1A2A] border border-[#1E3A5F] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente fechar?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {isLoading 
              ? "Você está gerando um QR Code. Se fechar agora, perderá o progresso."
              : hasQRCode 
                ? "A verificação do status da instância está em andamento. Se fechar agora, não poderá ver o resultado."
                : "Tem certeza que deseja fechar este formulário?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={() => onOpenChange(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white border-none"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            Sim, fechar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}