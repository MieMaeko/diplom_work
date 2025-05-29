import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  type?: string; 
}

export default function EditableField({ label, value, onSave, type = 'text' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      await onSave(inputValue.trim());
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setInputValue(value);
      setIsEditing(false);
    }
  };

  return (
    <p>
      <span>{label}:</span>{' '}
      {isEditing ? (
        <input
          type={type}
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setInputValue(value ?? '');
            setIsEditing(false);
          }}
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
          title="Кликните для редактирования"
        >
          {value || `Добавить ${label.toLowerCase()}`}
        </span>
      )}
    </p>
  );
}
