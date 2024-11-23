import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, Clock, Users, Zap } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: number | string;
  type: "online" | "closed" | "sending" | "created";
  icon?: "activity" | "clock" | "users" | "zap";
  onClick?: () => void;
}

export function StatusCard({ title, value, type, icon, onClick }: StatusCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "activity":
        return <Activity className="w-5 h-5 text-emerald-500" />;
      case "clock":
        return <Clock className="w-5 h-5 text-emerald-500" />;
      case "users":
        return <Users className="w-5 h-5 text-emerald-500" />;
      case "zap":
        return <Zap className="w-5 h-5 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "metric-card",
        onClick && "cursor-pointer hover:bg-white/5 transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="metric-label">{title}</span>
          {getIcon()}
        </div>
        <div className="flex items-center gap-2">
          <span className="metric-value">{value}</span>
        </div>
      </div>
    </Card>
  );
}