import { StatusCard } from "@/components/StatusCard";

interface StatusSectionProps {
  instancesData: any;
  isLoading: boolean;
  onStatusCardClick: (status: string) => void;
}

export function StatusSection({ instancesData, isLoading, onStatusCardClick }: StatusSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="animate-fade-in [animation-delay:400ms]">
        <StatusCard 
          title="Instâncias Enviando" 
          value={isLoading ? "..." : instancesData?.sendingCount || 0} 
          type="sending" 
        />
      </div>
      <div className="animate-fade-in [animation-delay:600ms]">
        <StatusCard 
          title="Instâncias Online" 
          value={isLoading ? "..." : instancesData?.onlineCount || 0} 
          type="online" 
        />
      </div>
      <div className="animate-fade-in [animation-delay:800ms]">
        <StatusCard 
          title="❌verificarDesconexao" 
          value={isLoading ? "..." : instancesData?.closedCount || 0} 
          type="closed" 
          onClick={() => onStatusCardClick("❌verificarDesconexao")}
        />
      </div>
    </div>
  );
}