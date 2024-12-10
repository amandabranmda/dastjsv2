import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RoasTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Data</TableHead>
        <TableHead className="text-right">Cliques</TableHead>
        <TableHead className="text-right">Envios</TableHead>
        <TableHead className="text-right">% Cliques</TableHead>
        <TableHead className="text-right">Vendas</TableHead>
        <TableHead className="text-right">Valor Ads</TableHead>
        <TableHead className="text-right">ROAS</TableHead>
      </TableRow>
    </TableHeader>
  );
}