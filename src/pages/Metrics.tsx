import { Activity, Users, Target, Calendar, MousePointer, CircleDot } from "lucide-react";
import { useInstances } from "@/hooks/useInstances";

const Metrics = () => {
  const { data: instancesData, isLoading } = useInstances();

  const calculateOptinRate = () => {
    if (!instancesData?.totalClicks || !instancesData?.totalLeads) return "0";
    const rate = (instancesData.totalLeads / instancesData.totalClicks) * 100;
    return rate.toFixed(2);
  };

  const calculateRemainingMessages = () => {
    if (!instancesData?.totalSendingLimit || !instancesData?.totalLeads) return "0";
    const remaining = instancesData.totalSendingLimit - instancesData.totalLeads;
    return remaining.toString();
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Primeira linha */}
        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:200ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Instâncias Online</span>
            <Activity className="text-emerald-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : instancesData?.onlineCount || 0}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:300ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Instâncias Close</span>
            <CircleDot className="text-red-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : instancesData?.closedCount || 0}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:400ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Instâncias Enviando</span>
            <Activity className="text-blue-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : instancesData?.sendingCount || 0}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:500ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Instâncias Criadas Hoje</span>
            <Calendar className="text-purple-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : "0"}
          </p>
        </div>

        {/* Segunda linha */}
        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:600ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Cliques</span>
            <MousePointer className="text-green-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : instancesData?.totalClicks || 0}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:700ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Leads</span>
            <Users className="text-yellow-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : instancesData?.totalLeads || 0}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:800ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Limite de leads</span>
            <Target className="text-orange-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : calculateRemainingMessages()}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 animate-fade-in [animation-delay:900ms]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Optin pressel</span>
            <Users className="text-indigo-500 w-5 h-5" />
          </div>
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : `${calculateOptinRate()}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;