import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useState } from "react";
import { RoasHeader } from "@/components/RoasHeader";
import { RoasTable } from "@/components/RoasTable";
import { toast } from "sonner";

interface MetricasHot {
  id: number;
  data: string;
  cliques: number | null;
  envios: number | null;
  percentualCliques: number | null;
  vendas: number | null;
  valorAds: number | null;
  roas: number | null;
}

const Roas = () => {
  const [date, setDate] = useState<Date>();

  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ["metricas-hot", date],
    queryFn: async () => {
      let query = supabase
        .from("9-metricasHot")
        .select("id,data,cliques,envios,percentualCliques,vendas,valorAds,roas")
        .order("data", { ascending: false });

      if (date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        console.log("Data formatada para busca:", formattedDate);
        query = query.eq("data", formattedDate);
      }

      const { data: queryData, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      console.log("Dados retornados:", queryData);
      return queryData as MetricasHot[];
    },
  });

  const updateRoasMutation = useMutation({
    mutationFn: async ({ id, roas }: { id: number; roas: number }) => {
      const { error } = await supabase
        .from("9-metricasHot")
        .update({ roas })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ROAS atualizado com sucesso!");
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao atualizar ROAS:", error);
      toast.error("Erro ao atualizar ROAS");
    },
  });

  const handleRoasUpdate = (id: number, roas: number) => {
    updateRoasMutation.mutate({ id, roas });
  };

  return (
    <div className="container mx-auto p-6">
      <RoasHeader date={date} onDateSelect={setDate} />
      <RoasTable 
        metrics={metrics} 
        isLoading={isLoading} 
        onRoasUpdate={handleRoasUpdate}
      />
    </div>
  );
};

export default Roas;