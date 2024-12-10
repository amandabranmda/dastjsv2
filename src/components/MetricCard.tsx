import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: React.ReactNode;
  type: "padrao" | "optin" | "sales";
}

export function MetricCard({ title, value, change, type }: MetricCardProps) {
  const getColor = () => {
    switch (type) {
      case "padrao":
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
    <Card className="bg-[#111827]/70 backdrop-blur-sm border border-white/5 p-4 sm:p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl sm:text-3xl font-semibold text-white break-all">{value}</p>
          <div className={cn("flex items-center gap-1", "text-[#10B981]")}>
            {typeof change === 'string' ? <span className="text-sm font-medium">{change}</span> : change}
          </div>
        </div>
      </div>
    </Card>
  );
}