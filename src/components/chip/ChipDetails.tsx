import { ChipNumber } from "./ChipNumber";
import { ChipLocation } from "./ChipLocation";
import { ChipStatus } from "./ChipStatus";
import { ChipResponsible } from "./ChipResponsible";
import { ChipObservation } from "./ChipObservation";

interface ChipDetailsProps {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
  obsChip: string;
  onUpdate: () => void;
}

export function ChipDetails({ 
  numeroChip, 
  localChip, 
  statusChip, 
  responsavelChip,
  obsChip,
  onUpdate 
}: ChipDetailsProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-xl border border-sky-600/20 shadow-lg hover:shadow-sky-600/10 transition-all duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <ChipNumber 
            numeroChip={numeroChip} 
          />
        </div>

        <div>
          <ChipLocation localChip={localChip} />
        </div>

        <div>
          <ChipStatus 
            statusChip={statusChip}
            numeroChip={numeroChip}
            onUpdate={onUpdate}
          />
        </div>

        <div>
          <ChipResponsible 
            responsavelChip={responsavelChip}
            numeroChip={numeroChip}
            onUpdate={onUpdate}
          />
        </div>

        <div>
          <ChipObservation 
            obsChip={obsChip}
            numeroChip={numeroChip}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </div>
  );
}