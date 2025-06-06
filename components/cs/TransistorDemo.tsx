'use client';

import { useState } from 'react';
import './transistor.css';
import { Checkbox } from '@/components/ui/Checkbox';
import { layerBg } from '@/components/ui/theme';

export default function TransistorDemo() {
  const [isFlowing, setIsFlowing] = useState(false);

  return (
    <div
      className={`w-full max-w-xs h-64 flex flex-col items-center justify-between py-3 relative ${layerBg}`}
    >
      {/* 상단 배선 (드레인/컬렉터) */}
      <div className="flex flex-col items-center w-full gap-2">
        <div className="mt-1 text-xs text-gray-400">Drain (D)</div>
        <div className="w-3/5 h-1 bg-[#5e5e5e]" />
      </div>

      {/* 트랜지스터 본체 */}
      <div className="relative w-20 h-20 border border-[#5e5e5e] flex items-center justify-center">
        {/* 게이트 라인 및 입력 */}
        <div className="absolute flex flex-col items-center left-[-6rem]">
          <span className="text-xs text-gray-400 absolute top-0 translate-y-[-100%]">
            Gate
          </span>
          <Checkbox
            checked={isFlowing}
            onCheckedChange={(checked) => setIsFlowing(checked === true)}
          />
        </div>

        <div className="absolute left-[-3rem] w-12 h-1 bg-[#5e5e5e]" />
      </div>

      {/* 하단 배선 (소스/이미터) */}
      <div className="flex flex-col items-center w-full gap-2">
        <div className="w-3/5 h-1 bg-[#5e5e5e]" />
        <div className="mt-1 text-xs text-gray-400">Source (S)</div>
      </div>

      {/* 전류 흐름 표시 */}
      {isFlowing && (
        <div className="flex flex-col items-center justify-between absolute top-17 bottom-10">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[flowUp_1s_ease-in-out_infinite]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[flowUp_1s_ease-in-out_infinite]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[flowUp_1s_ease-in-out_infinite]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[flowUp_1s_ease-in-out_infinite]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-[flowUp_1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
}
