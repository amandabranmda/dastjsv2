import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
        return "text-primary";
      case "sales":
        return "text-[#0EA5E9]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className="glass-card p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-400">{title}</h3>
          <span className={cn("text-xs font-medium", getColor())}>{type.toUpperCase()}</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold">{value}</p>
          <div className="flex items-center gap-1 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}