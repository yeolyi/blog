'use client';

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

// 측정 결과를 표시하는 컴포넌트
interface MeasurementResultProps {
  noisySignal: number;
  interpretedValue: number;
  isError: boolean;
}

const MeasurementResult: React.FC<MeasurementResultProps> = ({
  noisySignal,
  interpretedValue,
  isError,
}) => {
  return (
    <div className="p-4 bg-[#222222] border border-[#5e5e5e] text-sm break-keep">
      <p className="text-white">
        <span className="font-mono">{noisySignal.toFixed(2)}</span>로
        측정되었습니다.{' '}
        <span
          className={`font-bold ${isError ? 'text-[#ff7777]' : 'text-[#77ff77]'}`}
        >
          {interpretedValue}
        </span>
        로 해석되어
        {isError ? (
          <span className="text-[#ff7777] ml-1 font-bold">
            에러가 발생했습니다!
          </span>
        ) : (
          <span className="text-[#77ff77] ml-1 font-bold">
            정확하게 해석되었습니다.
          </span>
        )}
      </p>
    </div>
  );
};

// 신호 시각화 컴포넌트
interface SignalVisualizerProps {
  noisySignal: number;
  maxValue: number;
  threshold: number[];
}

const SignalVisualizer: React.FC<SignalVisualizerProps> = ({
  noisySignal,
  maxValue,
  threshold,
}) => {
  const isMultipleThresholds = Array.isArray(threshold);

  return (
    <div className="h-48 border border-[#5e5e5e] relative mb-4 bg-black">
      <div
        className="absolute left-0 w-full transition-all duration-300 bg-gray-600"
        style={{
          bottom: 0,
          height: `${(noisySignal / maxValue) * 100}%`,
          opacity: 0.8,
        }}
      />

      {/* 해석 임계값 표시 */}
      {(threshold as number[]).map((thresholdValue) => (
        <div
          key={`threshold-${thresholdValue}`}
          className="absolute left-0 w-full border-t border-dashed border-white pointer-events-none"
          style={{ bottom: `${(thresholdValue / maxValue) * 100}%` }}
        >
          <span className="absolute left-2 -mt-3 text-[9px] font-medium text-white">
            {thresholdValue.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
};

// 값 선택 버튼 그룹 컴포넌트
interface ValueSelectorProps {
  values: number[];
  selectedValue: number;
  onChange: (value: number) => void;
}

const ValueSelector: React.FC<ValueSelectorProps> = ({
  values,
  selectedValue,
  onChange,
}) => (
  <div className="flex flex-wrap gap-1 mb-4 h-19">
    {values.map((num) => (
      <button
        key={num}
        type="button"
        onClick={() => onChange(num)}
        className={`w-9 h-9 flex items-center justify-center text-sm font-medium cursor-pointer ${
          selectedValue === num
            ? 'bg-[#333333] text-white'
            : 'bg-[#222222] text-slate-300 hover:bg-[#444444]'
        }`}
      >
        {num}
      </button>
    ))}
  </div>
);

export default function SignalComparison(): React.ReactElement {
  const [binaryValue, setBinaryValue] = useState<number>(1);
  const [decimalValue, setDecimalValue] = useState<number>(5);
  const [noisyBinarySignal, setNoisyBinarySignal] = useState<number>(1);
  const [noisyDecimalSignal, setNoisyDecimalSignal] = useState<number>(0.5);

  // 노이즈 레벨 - 고정값으로 설정 (사용자 조절 불가)
  const noiseLevel = 0.1;

  // 2진법에서 사용할 값의 범위: 0 또는 1
  const binaryThreshold = 0.5;

  // 10진법에서 사용할 값의 범위: 0부터 9까지
  const decimalThresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  // 노이즈 레벨에 따라 -noiseLevel부터 +noiseLevel 사이의 랜덤 값 생성
  const getNoisySignal = useCallback((original: number): number => {
    const noise = (Math.random() * 2 - 1) * noiseLevel;
    return Math.max(0, Math.min(1, original + noise));
  }, []);

  // 랜덤 노이즈 적용 함수
  const applyRandomNoise = useCallback((): void => {
    setNoisyBinarySignal(getNoisySignal(binaryValue));
    setNoisyDecimalSignal(getNoisySignal(decimalValue / 10));
  }, [getNoisySignal, binaryValue, decimalValue]);

  // 값이 변경될 때 노이즈 적용 신호도 업데이트
  useEffect(() => {
    applyRandomNoise();
  }, [applyRandomNoise]);

  // 신호 값에서 2진법 해석
  const interpretBinary = (signal: number): number => {
    return signal > binaryThreshold ? 1 : 0;
  };

  // 신호 값에서 10진법 해석
  const interpretDecimal = (signal: number): number => {
    if (signal < 0.1) {
      return 0;
    }

    for (let i = 0; i < decimalThresholds.length; i++) {
      if (Math.abs(signal - decimalThresholds[i]) < 0.05) {
        return i + 1;
      }
    }

    return 1;
  };

  // 노이즈가 적용된 신호를 해석한 값
  const interpretedBinary = interpretBinary(noisyBinarySignal);
  const interpretedDecimal = interpretDecimal(noisyDecimalSignal);

  // 에러 상태 확인
  const binaryError = interpretedBinary !== binaryValue;
  const decimalError = interpretedDecimal !== decimalValue;

  return (
    <div className="mb-8 border border-[#5e5e5e] p-6 rounded-none not-prose bg-[#111111]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold text-white">
          신호 에러 비교: 2진법 vs 10진법
        </p>
        <button
          type="button"
          onClick={applyRandomNoise}
          className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white font-medium text-sm cursor-pointer"
        >
          랜덤 노이즈 적용
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* 2진법 표시 */}
        <div className="w-full md:w-1/2">
          <p className="font-bold text-md mb-2 text-white">2진법 (0 또는 1)</p>

          <ValueSelector
            values={[0, 1]}
            selectedValue={binaryValue}
            onChange={setBinaryValue}
          />

          <SignalVisualizer
            noisySignal={noisyBinarySignal}
            maxValue={1}
            threshold={[binaryThreshold]}
          />

          <MeasurementResult
            noisySignal={noisyBinarySignal}
            interpretedValue={interpretedBinary}
            isError={binaryError}
          />
        </div>

        {/* 10진법 표시 */}
        <div className="w-full md:w-1/2">
          <p className="font-bold text-md mb-2 text-white">10진법 (0~9)</p>

          <ValueSelector
            values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            selectedValue={decimalValue}
            onChange={setDecimalValue}
          />

          <SignalVisualizer
            noisySignal={noisyDecimalSignal}
            maxValue={1}
            threshold={decimalThresholds}
          />

          <MeasurementResult
            noisySignal={noisyDecimalSignal}
            interpretedValue={interpretedDecimal}
            isError={decimalError}
          />
        </div>
      </div>
    </div>
  );
}
