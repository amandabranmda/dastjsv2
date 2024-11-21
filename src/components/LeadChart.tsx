import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useInstances } from "@/hooks/useInstances";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export function LeadChart() {
  const { data: instancesData } = useInstances();
  
  const getLeadLimit = () => {
    if (!instancesData?.totalSendingLimit) return 300;
    return Math.round(instancesData.totalSendingLimit * 0.3);
  };

  const { data: leadsData } = useQuery({
    queryKey: ["daily-leads"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("2-leadsProjetoHot")
        .select("dataOptin")
        .like("dataOptin", `${today}%`);

      if (error) throw error;

      // Inicializa um objeto com todas as horas do dia começando com 0
      const hourCounts: { [key: string]: number } = {};
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, "0");
        hourCounts[hour] = 0;
      }

      // Conta os leads por hora
      data.forEach((lead) => {
        const hour = lead.dataOptin.split(" ")[1].split(":")[0];
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      // Converte para o formato esperado pelo gráfico
      return Object.entries(hourCounts).map(([hour, count]) => ({
        time: `${hour}:00`,
        value: count
      }));
    },
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  const chartData = leadsData || [
    { time: "00:00", value: 0 },
    { time: "03:00", value: 0 },
    { time: "06:00", value: 0 },
    { time: "09:00", value: 0 },
    { time: "12:00", value: 0 },
    { time: "15:00", value: 0 },
    { time: "18:00", value: 0 },
    { time: "21:00", value: 0 },
    { time: "23:00", value: 0 },
  ];

  return (
    <Card className="glass-card p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm text-gray-400">Progresso de Leads (24h)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 border border-border p-2 rounded-lg shadow-lg">
                        <p className="text-sm font-medium">
                          {payload[0].value} leads
                        </p>
                        <p className="text-xs text-gray-400">
                          {payload[0].payload.time}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}