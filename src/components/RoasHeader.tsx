import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, XCircle } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

interface RoasHeaderProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function RoasHeader({ date, onDateSelect }: RoasHeaderProps) {
  const handlePresetFilter = (preset: 'today' | '7days' | '30days') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (preset) {
      case 'today':
        onDateSelect(today);
        break;
      case '7days':
        onDateSelect(subDays(today, 7));
        break;
      case '30days':
        onDateSelect(subDays(today, 30));
        break;
    }
  };

  const handleMonthSelect = (month: string) => {
    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = startOfMonth(new Date(year, monthNumber - 1));
    onDateSelect(startDate);
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i);
    return {
      value: `2024-${i + 1}`,
      label: format(date, 'MMMM', { locale: ptBR })
    };
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent">
        Métricas Hot
      </h1>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetFilter('today')}
            className="transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetFilter('7days')}
            className="transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            Últimos 7 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetFilter('30days')}
            className="transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            Últimos 30 dias
          </Button>
        </div>

        <Select onValueChange={handleMonthSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal transition-all hover:border-primary/50 hover:bg-primary/5",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateSelect}
                initialFocus
                className="rounded-md border shadow-lg"
              />
            </PopoverContent>
          </Popover>

          {date && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDateSelect(undefined)}
              className="transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}