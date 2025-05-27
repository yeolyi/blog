'use client';

import { Slider as RadixSlider } from 'radix-ui';
import type { ReactNode } from 'react';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  label?: ReactNode;
  decorator?: ReactNode;
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
}

export default function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ariaLabel,
  ariaLabelledby,
  label,
  decorator,
  className = '',
  trackClassName = '',
  rangeClassName = '',
  thumbClassName = '',
}: SliderProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span id={ariaLabelledby} className="text-sm whitespace-nowrap">
          {label}
        </span>
      )}
      <RadixSlider.Root
        className={`relative flex items-center select-none touch-none h-5 ${className}`}
        value={[value]}
        onValueChange={([val]) => onValueChange(val)}
        max={max}
        min={min}
        step={step}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        <RadixSlider.Track
          className={`bg-white/20 relative grow rounded-full h-[3px] ${trackClassName}`}
        >
          <RadixSlider.Range
            className={`absolute bg-white rounded-full h-full ${rangeClassName}`}
          />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className={`block w-5 h-5 bg-white rounded-full hover:bg-gray-300 focus:bg-gray-300 cursor-pointer ${thumbClassName}`}
          aria-label={ariaLabel}
        />
      </RadixSlider.Root>
      {decorator}
    </div>
  );
}
