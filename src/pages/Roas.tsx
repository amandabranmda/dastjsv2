import { useState, useEffect } from "react";
import { RoasHeader } from "@/components/RoasHeader";
import { RoasTable } from "@/components/RoasTable";
import { MetricsPanel } from "@/components/roas/MetricsPanel";
import { DateRange } from "react-day-picker";
import { useRoasMetrics } from "@/hooks/useRoasMetrics";

const Roas = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const { metrics, isLoading, setupRealtimeSubscription } = useRoasMetrics(dateRange);

  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="space-y-6">
      <RoasHeader dateRange={dateRange} onDateRangeSelect={setDateRange} />
      <MetricsPanel metrics={metrics} />
      <RoasTable metrics={metrics} isLoading={isLoading} />
    </div>
  );
};

export default Roas;