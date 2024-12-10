import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  const [editingCell, setEditingCell] = useState<{ id: number; value: string } | null>(null);
  const { toast } = useToast();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando métricas...</div>;
  }

  const calculateRoas = (vendas: number | null, valorAds: number | null): string => {
    if (!vendas || !valorAds || valorAds === 0) return '0.00';
    return (vendas / valorAds).toFixed(2);
  };

  const handleEditStart = (id: number, value: number | null) => {
    setEditingCell({ id, value: value?.toString() || '' });
  };

  const handleEditChange = (value: string) => {
    if (editingCell) {
      setEditingCell({ ...editingCell, value });
    }
  };

  const handleEditComplete = async (metric: MetricasHot) => {
    if (!editingCell) return;

    try {
      const newValue = parseFloat(editingCell.value);
      
      if (isNaN(newValue)) {
        toast({
          title: "Erro",
          description: "Por favor, insira um valor numérico válido",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('9-metricasHot')
        .update({ vendas: newValue })
        .eq('data', metric.data);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Valor atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar valor:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o valor",
        variant: "destructive",
      });
    }

    setEditingCell(null);
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
              <TableCell className="text-right">
                {editingCell?.id === metric.id ? (
                  <Input
                    type="number"
                    value={editingCell.value}
                    onChange={(e) => handleEditChange(e.target.value)}
                    onBlur={() => handleEditComplete(metric)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditComplete(metric);
                      }
                    }}
                    className="w-24 text-right"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleEditStart(metric.id, metric.vendas)}
                    className="cursor-pointer hover:text-blue-500"
                  >
                    {metric.vendas ?? '0'}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">{metric.valorAds ?? '0'}</TableCell>
              <TableCell className="text-right">{calculateRoas(metric.vendas, metric.valorAds)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}