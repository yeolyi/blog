'use client';

import Slider from '@/components/ui/Slider';
import { border, failBg, layerBg, successBg } from '@/components/ui/theme';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

// 신호 시각화 컴포넌트
interface SignalVisualizerProps {
  value: number;
  range: [number, number];
}

const SignalVisualizer: React.FC<SignalVisualizerProps> = ({
  value,
  range,
}) => {
  const isError = value < range[0] || value > range[1];
  return (
    <div className={`h-48 ${border} relative mb-4 ${layerBg} text-xs`}>
      {/* 유효 범위 상한선 */}
      <div
        className="absolute left-0 w-full border-t-1 border-white z-10"
        style={{ bottom: `${range[1] * 100}%` }}
      >
        <span className="absolute right-2 -mt-1 -translate-y-full">
          유효 상한: {range[1].toFixed(2)}
        </span>
      </div>

      {/* 유효 범위 하한선 */}
      <div
        className="absolute left-0 w-full border-t-1 border-white z-10"
        style={{ bottom: `${range[0] * 100}%` }}
      >
        <span className="absolute right-2 mt-1">
          유효 하한: {range[0].toFixed(2)}
        </span>
      </div>

      {/* 신호값 */}
      <div
        className={`absolute left-0 w-full transition-all duration-300 ${
          isError ? failBg : successBg
        }`}
        style={{
          bottom: 0,
          height: `${value * 100}%`,
        }}
      />
    </div>
  );
};

export default function SignalComparison(): React.ReactElement {
  const [errorRate, setErrorRate] = useState<number>(10); // 기본 오류율 10%
  const [noisyBinarySignal, setNoisyBinarySignal] = useState<number>(0.75);
  const [noisyDecimalSignal, setNoisyDecimalSignal] = useState<number>(0.5);

  // 랜덤 노이즈 적용
  const applyRandomNoise = useCallback(() => {
    const noise = (Math.random() * 2 - 1) * (errorRate / 100);

    const getNoisySignal = (original: number): number => {
      return Math.max(0, Math.min(1, original + noise));
    };

    setNoisyBinarySignal(getNoisySignal(1));
    setNoisyDecimalSignal(getNoisySignal(0.5));
  }, [errorRate]);

  useEffect(() => {
    applyRandomNoise();
    const id = setInterval(applyRandomNoise, 1000);
    return () => clearInterval(id);
  }, [applyRandomNoise]);

  return (
    <div className={`p-6 not-prose ${layerBg} text-white`}>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/2">
          <p className="font-bold text-md mb-2">
            이진법 <span className="text-sm">목표값 1</span>
          </p>
          <SignalVisualizer value={noisyBinarySignal} range={[0.5, 1]} />
        </div>

        <div className="w-full md:w-1/2">
          <p className="font-bold text-md">
            십진법 <span className="text-sm mb-2">목표값 5</span>
          </p>
          <SignalVisualizer value={noisyDecimalSignal} range={[0.45, 0.55]} />
        </div>
      </div>

      <Slider
        label="오차 범위"
        value={errorRate}
        onValueChange={setErrorRate}
        min={0}
        max={50}
        step={1}
        className="w-full"
      />
    </div>
  );
}
