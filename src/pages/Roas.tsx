import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/roas/EditableCell";
import { calculateRoas, calculateCPL } from "@/components/roas/utils";
import { MetricasHot } from "@/types/metricas";

interface RoasTableRowProps {
  metric: MetricasHot;
  onUpdateVendas: (metric: MetricasHot, newValue: number) => void;
  onUpdateValorAds: (metric: MetricasHot, newValue: number) => void;
}

function RoasTableRow({ metric, onUpdateVendas, onUpdateValorAds }: RoasTableRowProps) {
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
      <TableCell className="text-right">
        <EditableCell
          value={metric.valorAds}
          onEdit={(newValue) => onUpdateValorAds(metric, newValue)}
        />
      </TableCell>
      <TableCell className="text-right">{calculateCPL(metric.valorAds, metric.envios)}</TableCell>
      <TableCell className="text-right">{calculateRoas(metric.vendas, metric.valorAds)}</TableCell>
    </TableRow>
  );
}

export default RoasTableRow;