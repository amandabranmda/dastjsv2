import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  title: string;
  onSort: () => void;
}

export function ChipsTableHeader({ title, onSort }: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          {title.includes("verificarDesconexao") ? "Pedido Desbloqueio" : "Ban Permanente"}
        </TableHead>
        <TableHead className="w-[50px]">Liberado</TableHead>
        <TableHead>Número do Chip</TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={onSort}
            className="hover:bg-transparent p-0 h-auto font-medium text-muted-foreground flex items-center gap-1"
          >
            Local do Chip
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </TableHead>
        {title.includes("Chips Liberados") && (
          <TableHead>Responsável</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}