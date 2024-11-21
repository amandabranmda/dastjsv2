import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface Instance {
  id: string;
  nomeInstancia: string;
  senderNumber: string;
  statusInstancia: string;
  enviosChipFull: number;
}

export function InstanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["instances", currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error, count } = await supabase
        .from("1-chipsInstancias")
        .select("nomeInstancia, senderNumber, statusInstancia, enviosChipFull", { count: "exact" })
        .eq("statusInstancia", "open")
        .range(start, end);

      if (error) throw error;

      return {
        instances: data as Instance[],
        totalCount: count || 0
      };
    }
  });

  const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 0;

  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <Card className="glass-card p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Gerenciamento de Instâncias</h3>
          <Input
            placeholder="Filtrar por nome..."
            className="max-w-xs bg-background/50"
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
                  <td colSpan={5} className="text-center py-4">
                    Carregando...
                  </td>
                </tr>
              ) : (
                data?.instances.map((instance) => (
                  <tr key={instance.nomeInstancia} className="border-b border-border">
                    <td className="py-3 text-sm">{instance.nomeInstancia}</td>
                    <td className="py-3 text-sm">{instance.senderNumber}</td>
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
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Card>
  );
}