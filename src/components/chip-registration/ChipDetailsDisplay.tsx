import { Label } from "../ui/label";

interface ChipDetails {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  chipCom?: string;
}

interface ChipDetailsDisplayProps {
  chipDetails: ChipDetails;
}

export function ChipDetailsDisplay({ chipDetails }: ChipDetailsDisplayProps) {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-center text-red-200 mb-4">
        Este número já consta no banco de dados
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-red-200">Local do Chip</Label>
          <p className="text-red-100">{chipDetails.localChip || '-'}</p>
        </div>
        <div>
          <Label className="text-red-200">Status do Chip</Label>
          <p className="text-red-100">{chipDetails.statusChip || '-'}</p>
        </div>
        {chipDetails.chipCom && (
          <div>
            <Label className="text-red-200">Chip Com</Label>
            <p className="text-red-100">{chipDetails.chipCom}</p>
          </div>
        )}
      </div>
    </div>
  );
}