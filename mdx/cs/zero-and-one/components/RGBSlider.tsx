'use client';

import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';

export default function RGBSlider() {
  const [red, setRed] = useState(128);
  const [green, setGreen] = useState(128);
  const [blue, setBlue] = useState(128);

  const rgbColor = `rgb(${red}, ${green}, ${blue})`;
  const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

  return (
    <div className="mb-8 border border-[#5e5e5e] p-6 rounded-none not-prose">
      <h3 className="text-xl font-semibold mb-6">RGB 컬러 슬라이더</h3>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-10 whitespace-nowrap">
            R: {red}
          </span>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[red]}
            onValueChange={([value]) => setRed(value)}
            max={255}
            min={0}
            step={1}
            aria-label="빨간색"
          >
            <Slider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-red-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white rounded-full hover:bg-gray-300 focus:bg-gray-300 cursor-pointer" />
          </Slider.Root>
          <span className="text-sm text-black/60 dark:text-white/60 min-w-[3ch]">
            {red}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-10 whitespace-nowrap">
            G: {green}
          </span>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[green]}
            onValueChange={([value]) => setGreen(value)}
            max={255}
            min={0}
            step={1}
            aria-label="초록색"
          >
            <Slider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white rounded-full hover:bg-gray-300 focus:bg-gray-300 cursor-pointer" />
          </Slider.Root>
          <span className="text-sm text-black/60 dark:text-white/60 min-w-[3ch]">
            {green}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-10 whitespace-nowrap">
            B: {blue}
          </span>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[blue]}
            onValueChange={([value]) => setBlue(value)}
            max={255}
            min={0}
            step={1}
            aria-label="파란색"
          >
            <Slider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white rounded-full hover:bg-gray-300 focus:bg-gray-300 cursor-pointer" />
          </Slider.Root>
          <span className="text-sm text-black/60 dark:text-white/60 min-w-[3ch]">
            {blue}
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div
          className="w-24 h-24 border border-[#5e5e5e] group-hover:border-white"
          style={{ backgroundColor: rgbColor }}
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">RGB:</span>
            <code className="bg-white/10 px-2 py-1 rounded text-sm">
              {rgbColor}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">HEX:</span>
            <code className="bg-white/10 px-2 py-1 rounded text-sm">
              {hexColor}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
