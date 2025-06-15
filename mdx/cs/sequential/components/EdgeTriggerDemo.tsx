'use client';

import Button from '@/components/ui/Button';
import { Clock, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export default function EdgeTriggerDemo() {
  const [clock, setClock] = useState(0);
  const [risingActive, setRisingActive] = useState(false);
  const [fallingActive, setFallingActive] = useState(false);

  const handlePointerDown = () => {
    setClock(1);
    setRisingActive(true);
    setTimeout(() => setRisingActive(false), 500);
  };

  const handlePointerUp = () => {
    setClock(0);
    setFallingActive(true);
    setTimeout(() => setFallingActive(false), 500);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-6">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
          <Lightbulb
            size={48}
            strokeWidth={2}
            className={risingActive ? 'stroke-yellow-400' : 'stroke-gray-400'}
          />
          <p className="text-sm">상승 엣지</p>
        </div>
        <div className="flex flex-col items-center">
          <Lightbulb
            size={48}
            strokeWidth={2}
            className={fallingActive ? 'stroke-yellow-400' : 'stroke-gray-400'}
          />
          <p className="text-sm">하강 엣지</p>
        </div>
      </div>
      <Button
        bg="green"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        Icon={Clock}
      >
        Clock ({clock})
      </Button>
    </div>
  );
}
