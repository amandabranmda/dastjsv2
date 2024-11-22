import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ChipTableProps {
  chips: any[];
  title: string;
  selectedChips: string[];
  onCopyChip: (chipNumber: string) => void;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
}

export function ChipTable({ chips, title, selectedChips, onCopyChip, onCheckboxChange }: ChipTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            {title.includes("verificarDesconexao") 
              ? "Pedido Desbloqueio" 
              : title.includes("Aguardando Desbloqueio")
              ? "Liberado"
              : "Status"}
          </TableHead>
          <TableHead>Número do Chip</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chips?.map((chip) => (
          <TableRow key={chip.numeroChip}>
            <TableCell>
              <Checkbox 
                onCheckedChange={(checked) => 
                  onCheckboxChange(
                    chip.numeroChip, 
                    checked as boolean, 
                    title.includes("verificarDesconexao")
                  )
                }
              />
            </TableCell>
            <TableCell 
              onClick={() => onCopyChip(chip.numeroChip)}
              className={cn(
                "cursor-pointer hover:text-[#FFD700] transition-colors",
                selectedChips.includes(chip.numeroChip) ? "text-[#FFD700]" : ""
              )}
            >
              {chip.numeroChip}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}