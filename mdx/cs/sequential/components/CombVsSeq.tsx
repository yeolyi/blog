'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bird, Brain, LightbulbIcon, LightbulbOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function CombVsSeq() {
  const t = useTranslations('Sequential.CombVsSeq');
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Card className="my-10">
      <CardHeader>
        <CardTitle>조합 논리 vs 순차 논리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-8 justify-center">
          <div className="flex flex-col items-center gap-5">
            <Bulb isOn={isPressed} />
            <Button
              variant="secondary"
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={() => setIsPressed(false)}
              onTouchCancel={() => setIsPressed(false)}
            >
              <Bird />
              {t('cannotRemember')}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-5">
            <Bulb isOn={isToggleOn} />
            <Button
              variant="secondary"
              onClick={() => setIsToggleOn((prev) => !prev)}
            >
              <Brain />
              {t('canRemember')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Bulb = ({ isOn }: { isOn: boolean }) => {
  return isOn ? (
    <LightbulbIcon size={50} className="stroke-yellow-500" />
  ) : (
    <LightbulbOff size={50} className="stroke-gray-500" />
  );
};
