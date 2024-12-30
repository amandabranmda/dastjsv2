interface ChipLocationProps {
  localChip: string;
}

export function ChipLocation({ localChip }: ChipLocationProps) {
  return (
    <p className="text-white font-medium">
      {localChip || '-'}
    </p>
  );
}