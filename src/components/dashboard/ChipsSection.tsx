import { StatusCard } from "@/components/StatusCard";
import { ChipRegistrationForm } from "@/components/ChipRegistrationForm";

interface ChipsSectionProps {
  instancesData: any;
  isLoading: boolean;
  onStatusCardClick: (status: string) => void;
}

export function ChipsSection({ instancesData, isLoading, onStatusCardClick }: ChipsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
      <div className="animate-fade-in [animation-delay:1400ms]">
        <StatusCard 
          title="Aguardando Desbloqueio" 
          value={isLoading ? "..." : instancesData?.waitingUnlockCount || 0}
          type="closed" 
          onClick={() => onStatusCardClick("aguardando desbloqueio")}
        />
      </div>
      <div className="animate-fade-in [animation-delay:1600ms]">
        <StatusCard 
          title="Chips Liberados" 
          value={isLoading ? "..." : instancesData?.releasedCount || 0}
          type="closed" 
          onClick={() => onStatusCardClick("liberado")}
        />
      </div>
      <div className="animate-fade-in [animation-delay:1800ms]">
        <ChipRegistrationForm />
      </div>
    </div>
  );
}