import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { ChipTableHeader } from "./chips/ChipTableHeader";
import { ChipTableRow } from "./chips/ChipTableRow";

interface ChipsTableProps {
  chips: any[];
  title: string;
  onCheckboxChange: (chipNumber: string, checked: boolean, isDisconnected: boolean) => void;
  onCopyChip: (chipNumber: string) => void;
  selectedChips: string[];
  checkedChips: string[];
  refetchData: () => void;
}

export function ChipsTable({ 
  chips, 
  title, 
  onCheckboxChange, 
  onCopyChip, 
  selectedChips, 
  refetchData 
}: ChipsTableProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedChips = [...chips].sort((a, b) => {
    const locationA = (a.localChip || '').toLowerCase();
    const locationB = (b.localChip || '').toLowerCase();
    
    if (sortOrder === 'asc') {
      return locationA.localeCompare(locationB);
    } else {
      return locationB.localeCompare(locationA);
    }
  });

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Table>
      <ChipTableHeader title={title} onSort={toggleSort} />
      <TableBody>
        {sortedChips?.map((chip) => (
          <ChipTableRow
            key={chip.numeroChip}
            chip={chip}
            title={title}
            onCheckboxChange={onCheckboxChange}
            onCopyChip={onCopyChip}
            selectedChips={selectedChips}
            refetchData={refetchData}
          />
        ))}
      </TableBody>
    </Table>
  );
}