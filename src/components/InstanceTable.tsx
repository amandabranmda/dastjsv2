import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, MessageSquare, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Instance {
  nomeInstancia: string;
  senderNumber: string;
  statusInstancia: string;
  enviosChipFull: number;
  localChip?: string;
  responsavelChip?: string;
}

export function InstanceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["instances-table"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("nomeInstancia, senderNumber, statusInstancia, enviosChipFull, localChip, responsavelChip")
        .eq("statusInstancia", "open");

      if (error) throw error;
      return data as Instance[];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('instance-table-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: '1-chipsInstancias'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const filteredData = data?.filter(instance => {
    const searchLower = searchTerm.toLowerCase();
    return (
      instance.senderNumber?.toLowerCase().includes(searchLower) ||
      instance.localChip?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card className="glass-card p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Gerenciamento de Instâncias</h3>
          <Input
            placeholder="Buscar por número ou local..."
            className="max-w-xs bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Seção
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Número
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Local
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Responsável
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Total de Leads
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Carregando...
                  </td>
                </tr>
              ) : (
                filteredData?.map((instance) => (
                  <tr key={instance.nomeInstancia} className="border-b border-border">
                    <td className="py-3 text-sm">{instance.nomeInstancia}</td>
                    <td className="py-3 text-sm">{instance.senderNumber}</td>
                    <td className="py-3 text-sm">{instance.localChip || '-'}</td>
                    <td className="py-3 text-sm">{instance.responsavelChip || '-'}</td>
                    <td className="py-3">
                      <span className="status-badge online">
                        {instance.statusInstancia}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{instance.enviosChipFull}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded-lg transition-colors text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}