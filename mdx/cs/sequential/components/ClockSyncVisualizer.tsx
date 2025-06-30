'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>클록 동기화 시각화</CardTitle>
        <CardDescription>
          클록 신호에 맞춰 각 단계의 계산이 순차적으로 진행됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="flex gap-2 items-center flex-wrap justify-center">
          {values.map((val, i) => {
            const out = val !== null ? computeFunctions[i](val) : null;
            return (
              <Fragment key={i}>
                <div className="flex flex-col items-center justify-center p-4 bg-muted text-center min-w-[140px] min-h-[80px]">
                  <p className="font-semibold">{functionDescriptions[i]}</p>
                  <p className="font-mono text-sm">
                    {val ?? '-'} → {out ?? '-'}
                  </p>
                </div>
                {i !== values.length - 1 && <span className="text-xl">👉</span>}
              </Fragment>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            variant="ghost"
            onClick={() => setValues([1, null, null, null])}
          >
            <RefreshCcw />
            {t('reset')}
          </Button>
          <Button onClick={handleClockClick} variant="secondary">
            <Clock />
            {t('clockSignal')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
