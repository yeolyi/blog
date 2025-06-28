'use client';

import Button from '@/components/ui/Button';
import { border, layerBg } from '@/components/ui/theme';
import clsx from 'clsx';
import { Power } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useEdgeTriggerClock } from '../hooks/useEdgeTriggerClock';

const useAnimatedFrameNow = () => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      setNow(Date.now());
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return now;
};

function ClockGraph({
  history,
  duration = 5000,
  width = 300,
  height = 100,
}: {
  history: { value: number; timestamp: number }[];
  duration?: number;
  width?: number;
  height?: number;
}) {
  const now = useAnimatedFrameNow();

  // 그래프에 표시할 시간 범위의 시작점을 계산합니다.
  const startTime = now - duration;

  // 현재 시간 범위 내에 있는 히스토리 데이터만 필터링합니다.
  const visibleHistory = history.filter((p) => p.timestamp >= startTime);

  // 그래프가 끊기지 않고 자연스럽게 이어지도록,
  // 보이는 시간 범위 바로 이전의 마지막 데이터 포인트를 찾습니다.
  const lastPointBefore = history.findLast((p) => p.timestamp < startTime);

  // 만약 이전 데이터 포인트가 있다면, 그래프의 시작점으로 추가합니다.
  if (lastPointBefore) {
    visibleHistory.unshift({ ...lastPointBefore, timestamp: startTime });
  } else if (history.length > 0) {
    // 이전 데이터가 없는 경우(모든 데이터가 보이는 시간 범위 안에 있을 때),
    // 첫번째 데이터 포인트를 시작점으로 하여 그래프가 전체 너비에 걸쳐 그려지도록 합니다.
    visibleHistory.unshift({
      ...history[0],
      timestamp: startTime,
    });
  }

  // 보이는 히스토리가 없는 경우(예: 앱이 방금 시작되었을 때)
  // 그래프가 비어있지 않도록 초기 상태를 설정합니다.
  if (visibleHistory.length === 0) {
    if (history.length > 0) {
      visibleHistory.push({
        ...history[history.length - 1],
        timestamp: startTime,
      });
    } else {
      visibleHistory.push({ value: 0, timestamp: startTime });
    }
  }

  // 히스토리 데이터를 SVG 좌표로 변환합니다.
  // y 좌표는 위아래를 뒤집고(SVG 좌표계는 위가 0), 약간의 여백을 줍니다.
  const points = visibleHistory.map((p) => ({
    x: ((p.timestamp - startTime) / duration) * width,
    y: height - (p.value * (height - 20) + 10),
  }));

  // SVG path 데이터를 생성합니다.
  // `H` (Horizontal lineto)와 `V` (Vertical lineto)를 사용하여 계단 모양의 그래프를 그립니다.
  let pathData = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` H ${points[i].x} V ${points[i].y}`;
  }
  // 마지막 포인터에서 그래프 오른쪽 끝까지 선을 이어줍니다.
  pathData += ` H ${width}`;

  return (
    <svg width={width} height={height} className={clsx(border)}>
      <title>{'클럭 신호 그래프'}</title>
      <path
        d={pathData}
        stroke="var(--color-green-500)"
        strokeWidth="2"
        fill="none"
        suppressHydrationWarning
      />
    </svg>
  );
}

export default function EdgeTriggerDemo() {
  const t = useTranslations('Sequential.EdgeTriggerDemo');
  const {
    clock,
    history,
    risingActive,
    fallingActive,
    handlePointerDown,
    handlePointerUp,
  } = useEdgeTriggerClock();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-4 p-6 not-prose',
        layerBg,
      )}
    >
      <div className="flex items-center gap-8 justify-center">
        <div className="flex flex-col items-center">
          <p
            className={clsx(
              'text-base',
              risingActive && 'text-green-400 font-bold',
            )}
          >
            {t('risingEdge')}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p
            className={clsx(
              'text-base',
              fallingActive && 'text-green-400 font-bold',
            )}
          >
            {t('fallingEdge')}
          </p>
        </div>
      </div>
      <ClockGraph history={history} />
      <Button
        bg="gray"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        Icon={Power}
      >
        {t('clock')} ({clock})
      </Button>
    </div>
  );
}
