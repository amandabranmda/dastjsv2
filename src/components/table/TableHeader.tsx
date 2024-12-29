import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface ChipsTableHeaderProps {
  title: string;
  onSort: () => void;
}

export function ChipsTableHeader({ title, onSort }: ChipsTableHeaderProps) {
  return (
    <TableHeader className="bg-black/40 sticky top-0">
      <TableRow>
        <TableHead className="w-[50px]">Ban</TableHead>
        <TableHead className="w-[80px]">Liberado</TableHead>
        <TableHead>Número do Chip</TableHead>
        <TableHead 
          onClick={onSort}
          className="cursor-pointer hover:text-sky-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            Local do Chip
            <ArrowUpDown className="h-4 w-4" />
          </div>
        </TableHead>
        {title.includes("Chips Liberados") && (
          <TableHead>Responsável</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}