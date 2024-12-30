import { Button } from "../ui/button";
import { Printer } from "lucide-react";
import { ChipDetails } from "./ChipDetails";
import { PDFContent } from "../pdf/PDFContent";
import { usePDF } from "react-to-pdf";
import { toast } from "sonner";

interface SearchResultsProps {
  chipDetails: Array<{
    numeroChip: string;
    localChip: string;
    statusChip: string;
    responsavelChip: string;
    obsChip: string;
  }>;
  onUpdate: () => void;
  searchNumber: string;
}

export function SearchResults({ chipDetails, onUpdate, searchNumber }: SearchResultsProps) {
  const { toPDF, targetRef } = usePDF({
    filename: `pesquisa-chips-${searchNumber}.pdf`,
  });

  const handlePrintPDF = async () => {
    if (!chipDetails.length) {
      toast.error("Nenhum resultado para imprimir");
      return;
    }

    try {
      await toPDF();
      toast.success("PDF gerado e salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    }
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-red-200">
          {chipDetails.length === 1 
            ? "Este número já consta no banco de dados"
            : `Foram encontrados ${chipDetails.length} resultados`}
        </p>
        <Button
          onClick={handlePrintPDF}
          variant="outline"
          size="sm"
          className="gap-2 text-sky-400 hover:text-sky-300 border-sky-400/50 hover:border-sky-300/50"
        >
          <Printer className="w-4 h-4" />
          Imprimir PDF
        </Button>
      </div>
      <div className="space-y-6">
        {chipDetails.map((chip) => (
          <ChipDetails 
            key={chip.numeroChip}
            numeroChip={chip.numeroChip}
            localChip={chip.localChip} 
            statusChip={chip.statusChip}
            responsavelChip={chip.responsavelChip}
            obsChip={chip.obsChip}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={targetRef}>
          <PDFContent chipDetails={chipDetails} />
        </div>
      </div>
    </div>
  );
}