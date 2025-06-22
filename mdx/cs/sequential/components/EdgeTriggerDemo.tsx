'use client';

import Button from '@/components/ui/Button';
import { Clock, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function EdgeTriggerDemo() {
  const t = useTranslations('Sequential.EdgeTriggerDemo');
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
    <div className="flex flex-col items-start gap-2 p-6">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
          <Lightbulb
            size={48}
            strokeWidth={2}
            className={risingActive ? 'stroke-yellow-400' : 'stroke-gray-400'}
          />
          <p className="text-sm">{t('risingEdge')}</p>
        </div>
        <div className="flex flex-col items-center">
          <Lightbulb
            size={48}
            strokeWidth={2}
            className={fallingActive ? 'stroke-yellow-400' : 'stroke-gray-400'}
          />
          <p className="text-sm">{t('fallingEdge')}</p>
        </div>
      </div>
      <Button
        bg="gray"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        Icon={Clock}
      >
        {t('clock')} ({clock})
      </Button>
    </div>
  );
}
