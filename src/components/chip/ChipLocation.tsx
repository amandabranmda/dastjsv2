interface ChipLocationProps {
  localChip: string;
}

export function ChipLocation({ localChip }: ChipLocationProps) {
  return (
    <div className="flex items-center">
      <p className="text-white font-medium">
        {localChip || '-'}
      </p>
    </div>
  );
}