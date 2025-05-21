import type { InputHTMLAttributes } from 'react';

export default function Tag({
  label,
  id,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="relative">
      <input
        id={id}
        className="absolute opacity-0 w-full h-full cursor-pointer peer"
        {...inputProps}
      />
      <label
        htmlFor={id}
        className="inline-block py-1 px-2 text-sm bg-stone-700 text-white border-2 border-transparent peer-checked:border-white peer-hover:opacity-80 active:opacity-60 cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
