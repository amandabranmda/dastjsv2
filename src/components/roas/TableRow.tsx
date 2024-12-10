import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "./EditableCell";
import { calculateRoas } from "./utils";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
}

interface RoasTableRowProps {
  metric: MetricasHot;
  onUpdateVendas: (metric: MetricasHot, newValue: number) => void;
}

export function RoasTableRow({ metric, onUpdateVendas }: RoasTableRowProps) {
  return (
    <TableRow>
      <TableCell>{metric.data}</TableCell>
      <TableCell className="text-right">{metric.cliques ?? '0'}</TableCell>
      <TableCell className="text-right">{metric.envios ?? '0'}</TableCell>
      <TableCell className="text-right">
        {metric.percentualCliques ? metric.percentualCliques.toFixed(2) : '0.00'}
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={metric.vendas}
          onEdit={(newValue) => onUpdateVendas(metric, newValue)}
        />
      </TableCell>
      <TableCell className="text-right">{metric.valorAds ?? '0'}</TableCell>
      <TableCell className="text-right">{calculateRoas(metric.vendas, metric.valorAds)}</TableCell>
    </TableRow>
  );
}