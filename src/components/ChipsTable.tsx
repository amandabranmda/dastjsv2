import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ChipsTableProps {
  chips: any[];
  title: string;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  onCopyChip: (chipNumber: string) => void;
  selectedChips: string[];
}

export function ChipsTable({ chips, title, onCheckboxChange, onCopyChip, selectedChips }: ChipsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            {title.includes("verificarDesconexao") ? "Pedido Desbloqueio" : "Liberado"}
          </TableHead>
          <TableHead>Número do Chip</TableHead>
          <TableHead>Local do Chip</TableHead>
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
            <TableCell>{chip.localChip || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}