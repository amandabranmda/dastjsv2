import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EditableCellProps {
  value: number | null;
  onEdit: (value: number) => void;
}

export function EditableCell({ value, onEdit }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');

  const handleEditComplete = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue)) {
      onEdit(newValue);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleEditComplete}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleEditComplete();
          }
        }}
        className="w-20 h-7 px-1 text-right bg-transparent border-none focus:outline-none focus:ring-0"
        autoFocus
      />
    );
  }

  return (
    <span
      onClick={() => {
        setIsEditing(true);
        setEditValue(value?.toString() || '');
      }}
      className="cursor-pointer hover:text-blue-500"
    >
      {value ?? '0'}
    </span>
  );
}