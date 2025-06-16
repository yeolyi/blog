'use client';

import Button from '@/components/ui/Button';
import { border, layerBg } from '@/components/ui/theme';
import clsx from 'clsx';
import { Clock, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

const computeFunctions = [
  (x: number) => x * 2,
  (x: number) => x + 10,
  (x: number) => x - 3,
  (x: number) => x * x,
];

const functionDescriptions = [
  'f(x) = x * 2',
  'f(x) = x + 10',
  'f(x) = x - 3',
  'f(x) = x * x',
];

export default function ClockSyncVisualizer() {
  const t = useTranslations('Sequential.ClockSyncVisualizer');
  const [values, setValues] = useState<(number | null)[]>([
    1,
    null,
    null,
    null,
  ]);

  const handleClockClick = () => {
    setValues((prev) => {
      const newValues = [...prev];
      for (let i = newValues.length - 1; i > 0; i--) {
        const prev = newValues[i - 1];
        if (prev !== null) {
          newValues[i] = computeFunctions[i - 1](prev);
        }
      }
      newValues[0] = (newValues[0] ?? 0) + 1;
      return newValues;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-2 items-center flex-wrap">
        {values.map((val, i) => {
          const out = val !== null ? computeFunctions[i](val) : null;
          return (
            <Fragment key={i}>
              <div
                className={clsx(
                  'flex items-center justify-center p-4',
                  layerBg,
                  border,
                )}
              >
                {functionDescriptions[i]}
                <br />
                {val ?? '-'} → {out ?? '-'}
              </div>
              {i !== values.length - 1 && <span className="text-xl">👉</span>}
            </Fragment>
          );
        })}
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          onClick={() => setValues([1, null, null, null])}
          bg="transparent"
          Icon={RefreshCcw}
        >
          {t('reset')}
        </Button>
        <Button
          onClick={handleClockClick}
          className="text-lg"
          bg="gray"
          Icon={Clock}
        >
          {t('clockSignal')}
        </Button>
      </div>
    </div>
  );
}
