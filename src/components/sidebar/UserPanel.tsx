import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/presence/Avatar';

interface UserPanelProps {
  name: string;
  color: string;
  onNameChange: (name: string) => void;
}

export default function UserPanel({ name, color, onNameChange }: UserPanelProps) {
  const [localName, setLocalName] = useState(name);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalName(name);
  }, [name]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setLocalName(newName);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (newName.trim()) {
          onNameChange(newName.trim());
        }
      }, 300);
    },
    [onNameChange],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar name={name} color={color} size={32} isSelf />
        <Input
          value={localName}
          onChange={handleChange}
          className="bg-transparent border-transparent text-sm focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)] h-8"
          style={{ color: 'var(--text)' }}
        />
      </div>
    </div>
  );
}
