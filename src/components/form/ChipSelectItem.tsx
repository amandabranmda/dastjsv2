import { SelectItem } from "@/components/ui/select";

interface ChipSelectItemProps {
  numeroChip: string;
  localChip?: string;
}

export function ChipSelectItem({ numeroChip, localChip }: ChipSelectItemProps) {
  return (
    <SelectItem 
      key={numeroChip} 
      value={numeroChip}
      className="flex items-center justify-between gap-2 hover:bg-white/5"
    >
      <div className="flex flex-col">
        <span className="font-medium text-base">{numeroChip}</span>
        <span className="text-sm text-muted-foreground">{localChip || 'Sem local'}</span>
      </div>
    </SelectItem>
  );
}