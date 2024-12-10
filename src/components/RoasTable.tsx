import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
}

interface RoasTableProps {
  metrics: MetricasHot[] | undefined;
  isLoading: boolean;
}

export function RoasTable({ metrics, isLoading }: RoasTableProps) {
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando métricas...</div>;
  }

  const calculateRoas = (vendas: number | null, valorAds: number | null): string => {
    if (!vendas || !valorAds || valorAds === 0) return '0.00';
    return (vendas / valorAds).toFixed(2);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
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
        <TableBody>
          {metrics?.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell>{metric.data}</TableCell>
              <TableCell className="text-right">{metric.cliques ?? '0'}</TableCell>
              <TableCell className="text-right">{metric.envios ?? '0'}</TableCell>
              <TableCell className="text-right">
                {metric.percentualCliques ? metric.percentualCliques.toFixed(2) : '0.00'}
              </TableCell>
              <TableCell className="text-right">{metric.vendas ?? '0'}</TableCell>
              <TableCell className="text-right">{metric.valorAds ?? '0'}</TableCell>
              <TableCell className="text-right">{calculateRoas(metric.vendas, metric.valorAds)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}