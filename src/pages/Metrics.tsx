import { MetricCard } from "@/components/MetricCard";
import { Activity, Users, Target, Calendar, Cursor, CircleDot } from "lucide-react";
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
    <div className="space-y-8 p-6 bg-[#0A0A0A] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>
      
      {/* First Row - Instance Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in [animation-delay:200ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Instâncias Online</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : instancesData?.onlineCount || 0}
                </p>
              </div>
              <Activity className="text-emerald-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:300ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Instâncias Close</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : instancesData?.closedCount || 0}
                </p>
              </div>
              <CircleDot className="text-red-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:400ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Instâncias Enviando</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : instancesData?.sendingCount || 0}
                </p>
              </div>
              <Activity className="text-blue-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:500ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Instâncias Criadas Hoje</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : "0"}
                </p>
              </div>
              <Calendar className="text-purple-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in [animation-delay:600ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Cliques</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : instancesData?.totalClicks || 0}
                </p>
              </div>
              <Cursor className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:700ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Leads</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : instancesData?.totalLeads || 0}
                </p>
              </div>
              <Users className="text-yellow-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:800ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Limite de leads</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : calculateRemainingMessages()}
                </p>
              </div>
              <Target className="text-orange-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:900ms]">
          <div className="p-6 rounded-lg bg-[#111827]/70 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Optin pressel</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {isLoading ? "..." : `${calculateOptinRate()}%`}
                </p>
              </div>
              <Users className="text-indigo-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;