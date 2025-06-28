import type { OutputAtom, OutputValue } from '@/components/cs/flow/model/type';
import { useAtom } from 'jotai';
import { Tag } from 'lucide-react';
import { useState } from 'react';

export default function NameTag({ atom }: { atom: OutputAtom }) {
  const [label, setLabel] = useAtom(atom);
  const [isEditing, setIsEditing] = useState(false);

  const handleLabelChange = (val: OutputValue) => {
    if (typeof val === 'string') {
      setLabel(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="absolute top-0 -translate-y-full left-0 flex right-0">
      {isEditing ? (
        <input
          defaultValue={label?.toString() ?? ''}
          onBlur={(e) => handleLabelChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLabelChange(e.currentTarget.value);
            }
          }}
          className="h-4 text-xs bg-white text-black px-1 border-none outline-none w-full"
          // biome-ignore lint/a11y/noAutofocus: <explanation>
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
          }}
          type="button"
          className="cursor-pointer shrink-0"
        >
          {label ? (
            <span className="text-xs font-mono min-w-fit text-white">
              {label.toString()}
            </span>
          ) : (
            <Tag size={12} color="white" />
          )}
        </button>
      )}
    </div>
  );
}
