import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface ChipsTableProps {
  chips: any[];
  title: string;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  onCopyChip: (chipNumber: string) => void;
  selectedChips: string[];
  checkedChips: string[];
}

export function ChipsTable({ chips, title, onCheckboxChange, onCopyChip, selectedChips, checkedChips }: ChipsTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedChips = [...chips].sort((a, b) => {
    const locationA = (a.localChip || '').toLowerCase();
    const locationB = (b.localChip || '').toLowerCase();
    
    if (sortOrder === 'asc') {
      return locationA.localeCompare(locationB);
    } else {
      return locationB.localeCompare(locationA);
    }
  });

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  const handleCopyChip = (chipNumber: string) => {
    if (title.includes("verificarDesconexao")) {
      navigator.clipboard.writeText(chipNumber);
      toast({
        description: "Número do chip copiado!",
        duration: 2000,
      });
      onCopyChip(chipNumber);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            {title.includes("verificarDesconexao") ? "Pedido Desbloqueio" : "Liberado"}
          </TableHead>
          <TableHead>Número do Chip</TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={toggleSort}
              className="hover:bg-transparent p-0 h-auto font-medium text-muted-foreground flex items-center gap-1"
            >
              Local do Chip
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedChips?.map((chip) => (
          <TableRow key={chip.numeroChip}>
            <TableCell>
              <Checkbox 
                checked={title.includes("Chips Liberados") ? checkedChips.includes(chip.numeroChip) : undefined}
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
              onClick={() => handleCopyChip(chip.numeroChip)}
              className={cn(
                "cursor-pointer transition-colors",
                selectedChips.includes(chip.numeroChip) ? "text-[#B8860B]" : "text-white hover:text-[#FFD700]",
                title.includes("verificarDesconexao") && "hover:text-blue-400"
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