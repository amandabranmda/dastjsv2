import { StatusCard } from "@/components/StatusCard";
import { useInstances } from "@/hooks/useInstances";

const Messages = () => {
  const { data: instancesData, isLoading } = useInstances();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Quantidade Liberada</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="animate-fade-in [animation-delay:200ms]">
          <StatusCard 
            title="Quantidade Liberada" 
            value={isLoading ? "..." : instancesData?.productionCount || 0} 
            type="closed" 
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;