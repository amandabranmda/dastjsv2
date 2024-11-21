import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Instance {
  id: string;
  number: string;
  status: "open" | "closed";
  leads: number;
  qrStatus: "connected" | "disconnected";
}

const instances: Instance[] = [
  {
    id: "zap1",
    number: "558396149164",
    status: "open",
    leads: 0,
    qrStatus: "connected",
  },
  {
    id: "zap2",
    number: "558396000516",
    status: "open",
    leads: 0,
    qrStatus: "connected",
  },
  {
    id: "zap3",
    number: "558396076909",
    status: "open",
    leads: 0,
    qrStatus: "connected",
  },
];

export function InstanceTable() {
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
                  Status do QR
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {instances.map((instance) => (
                <tr key={instance.id} className="border-b border-border">
                  <td className="py-3 text-sm">{instance.id}</td>
                  <td className="py-3 text-sm">{instance.number}</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "status-badge",
                        instance.status === "open" ? "online" : "closed"
                      )}
                    >
                      {instance.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{instance.leads}</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "status-badge",
                        instance.qrStatus === "connected" ? "online" : "closed"
                      )}
                    >
                      {instance.qrStatus}
                    </span>
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}