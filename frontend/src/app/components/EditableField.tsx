import { useState } from 'react';
import styles from '../user/profile/styles/profile.module.scss'
interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
  type?: string;
}

export default function EditableField({ label, value, onSave, type = 'text' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');
  const [error, setError] = useState('');

  const validateInput = (val: string): boolean => {
    const trimmed = val.trim();

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(trimmed);
    }

    if (type === 'tel') {
      const digits = val.replace(/\D/g, '');
      return digits.length === 11 && digits.startsWith('7');
    }

    return true;
  };
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').replace(/^8/, '7');
    const trimmed = digits.slice(0, 11);

    let formatted = '+7';
    if (trimmed.length > 1) formatted += ' (' + trimmed.slice(1, 4);
    if (trimmed.length >= 4) formatted += ') ' + trimmed.slice(4, 7);
    if (trimmed.length >= 7) formatted += '-' + trimmed.slice(7, 9);
    if (trimmed.length >= 9) formatted += '-' + trimmed.slice(9, 11);

    return formatted;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'tel') {
      setInputValue(formatPhone(e.target.value));
    } else {
      setInputValue(e.target.value);
    }
  };


  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = inputValue.trim();

      if (!validateInput(trimmed)) {
        setError(
          type === 'email'
            ? 'Введите корректный email'
            : type === 'tel'
              ? 'Введите корректный номер телефона'
              : 'Неверное значение'
        );
        return;
      }

      await onSave(trimmed);
      setIsEditing(false);
      setError('');
    }

    if (e.key === 'Escape') {
      setInputValue(value ?? '');
      setIsEditing(false);
      setError('');
    }
  };

  return (
    <div className={styles.field}>
      <span>{label}:</span>{' '}
      {isEditing ? (
        <div>
          <input
            type={type}
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setInputValue(value ?? '');
              setIsEditing(false);
              setError('');
            }}
            maxLength={type === 'tel' ? 18 : undefined}
            placeholder={
              type === 'tel'
                ? '+7 (___) ___-__-__'
                : type === 'email'
                  ? 'example@domain.com'
                  : ''
            }
          />
          {error && (
            <p className={styles.errorField}>{error}</p>
          )}
        </div>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#FFA09A' }}
          title="Кликните для редактирования"
        >
          {value || `Добавить ${label.toLowerCase()}`}
        </span>
      )}
    </div>
  );
}
