import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: number;
  type: "online" | "closed" | "sending";
}

export function StatusCard({ title, value, type }: StatusCardProps) {
  return (
    <Card className="glass-card p-6 animate-fade-in-scale">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "w-2 h-2 rounded-full",
            type === "online" && "bg-primary",
            type === "closed" && "bg-destructive",
            type === "sending" && "bg-secondary"
          )} />
          <h3 className="text-sm text-gray-400">{title}</h3>
        </div>
        <p className="text-4xl font-semibold">{value}</p>
      </div>
    </Card>
  );
}