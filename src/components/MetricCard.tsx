import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  type: "preset" | "optin" | "sales";
}

export function MetricCard({ title, value, change, type }: MetricCardProps) {
  const getColor = () => {
    switch (type) {
      case "preset":
        return "text-[#9333EA]";
      case "optin":
        return "text-[#10B981]";
      case "sales":
        return "text-[#0EA5E9]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className="bg-[#111827]/70 backdrop-blur-sm border border-white/5 p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
          <span className={cn("text-xs font-medium uppercase", getColor())}>{type}</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold text-white">{value}</p>
          <div className={cn("flex items-center gap-1", "text-[#10B981]")}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}