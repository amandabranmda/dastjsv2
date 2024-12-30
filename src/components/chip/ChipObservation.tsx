interface ChipObservationProps {
  obsChip: string;
}

export function ChipObservation({ obsChip }: ChipObservationProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-400">Observações</p>
      <p className="text-sm">{obsChip || '-'}</p>
    </div>
  );
}