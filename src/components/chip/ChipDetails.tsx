import { Label } from "../ui/label";

interface ChipDetailsProps {
  localChip: string;
  statusChip: string;
  responsavelChip: string;
}

export function ChipDetails({ localChip, statusChip, responsavelChip }: ChipDetailsProps) {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-center text-red-200 mb-4">
        Este número já consta no banco de dados
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-red-200">Local do Chip</Label>
          <p className="text-red-100">{localChip || '-'}</p>
        </div>
        <div>
          <Label className="text-red-200">Status do Chip</Label>
          <p className="text-red-100">{statusChip || '-'}</p>
        </div>
        <div>
          <Label className="text-red-200">Responsável</Label>
          <p className="text-red-100">{responsavelChip || '-'}</p>
        </div>
      </div>
    </div>
  );
}