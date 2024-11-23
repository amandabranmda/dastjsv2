import { Card } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, Target, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  type: "sales" | "orders" | "leads" | "ticket";
}

export function MetricCard({ title, value, change, type }: MetricCardProps) {
  const getIcon = () => {
    switch (type) {
      case "sales":
        return <ShoppingCart className="w-5 h-5 text-emerald-500" />;
      case "orders":
        return <ShoppingCart className="w-5 h-5 text-emerald-500" />;
      case "leads":
        return <Target className="w-5 h-5 text-emerald-500" />;
      case "ticket":
        return <DollarSign className="w-5 h-5 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="metric-card">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="metric-label">{title}</span>
          {getIcon()}
        </div>
        <div className="flex items-center justify-between">
          <span className="metric-value">{value}</span>
          {change && (
            <div className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}