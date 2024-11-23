import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectionStatusAlertProps {
  status: 'success' | 'error' | null;
}

export function ConnectionStatusAlert({ status }: ConnectionStatusAlertProps) {
  if (!status) return null;

  return (
    <Alert 
      className={`animate-fade-in ${
        status === 'success' 
          ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
          : 'bg-red-500/20 text-red-500 border-red-500/30'
      }`}
    >
      <AlertDescription>
        {status === 'success' 
          ? 'Instância conectada com sucesso!' 
          : 'Erro ao conectar instância!'}
      </AlertDescription>
    </Alert>
  );
}