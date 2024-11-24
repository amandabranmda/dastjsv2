import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface InstanceStatusAlertProps {
  message: string | null;
  type: 'success' | 'warning' | 'error' | null;
}

export function InstanceStatusAlert({ message, type }: InstanceStatusAlertProps) {
  if (!message || !type) return null;

  return (
    <Alert 
      className={cn(
        "animate-fade-in mb-6",
        type === 'success' && "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
        type === 'warning' && "bg-orange-500/20 text-orange-500 border-orange-500/30",
        type === 'error' && "bg-red-500/20 text-red-500 border-red-500/30"
      )}
    >
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}