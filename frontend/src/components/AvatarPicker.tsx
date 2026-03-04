import { useState } from 'react';
import { CheckCircle } from '@phosphor-icons/react';
import { DEFAULT_AVATARS } from '../constants/avatars';

interface AvatarPickerProps {
  currentUrl?: string;
  onSelect: (url: string) => void;
  saving?: boolean;
}

export default function AvatarPicker({ currentUrl, onSelect, saving }: AvatarPickerProps) {
  const [selected, setSelected] = useState(currentUrl || '');

  const hasChanged = selected !== currentUrl;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {DEFAULT_AVATARS.map((avatar) => {
          const isActive = selected === avatar.url;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setSelected(avatar.url)}
              className={`group relative w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-150 ${
                isActive
                  ? 'border-gold-500 ring-2 ring-gold-500/30 scale-110'
                  : 'border-gray-700 hover:border-gray-500 hover:scale-105'
              }`}
              title={avatar.name}
            >
              <img
                src={avatar.url}
                alt={avatar.name}
                className="w-full h-full object-cover bg-gray-800"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {hasChanged && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect(selected)}
            disabled={saving}
            className="btn-primary px-5 py-2 flex items-center gap-2 text-sm"
          >
            <CheckCircle size={16} weight="bold" />
            {saving ? 'Saving...' : 'Save Avatar'}
          </button>
          <button
            onClick={() => setSelected(currentUrl || '')}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
