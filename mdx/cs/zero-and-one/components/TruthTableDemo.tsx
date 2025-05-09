'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function TruthTableDemo() {
  const t = useTranslations('ZeroAndOne.TruthTableDemo');
  const [inputA, setInputA] = useState(true);
  const [inputB, setInputB] = useState(false);

  // 진리표 데이터
  const truthTable = [
    { id: 'row-0-0', a: false, b: false, output: false },
    { id: 'row-0-1', a: false, b: true, output: false },
    { id: 'row-1-0', a: true, b: false, output: false },
    { id: 'row-1-1', a: true, b: true, output: true },
  ];

  // 현재 선택된 행 계산
  const currentRow = truthTable.findIndex(
    (row) => row.a === inputA && row.b === inputB,
  );

  return (
    <div className="mb-8 not-prose">
      <table className="w-full border-collapse border border-[#5e5e5e]">
        <thead>
          <tr className="bg-white/10">
            <th className="border border-[#5e5e5e] p-2 text-center">
              {t('rainForecast')}
              <div className="flex justify-center mt-1">
                <input
                  type="checkbox"
                  id="input-a"
                  className="w-4 h-4 cursor-pointer"
                  checked={inputA}
                  onChange={(e) => setInputA(e.target.checked)}
                />
              </div>
            </th>
            <th className="border border-[#5e5e5e] p-2 text-center">
              {t('goingOut')}
              <div className="flex justify-center mt-1">
                <input
                  type="checkbox"
                  id="input-b"
                  className="w-4 h-4 cursor-pointer"
                  checked={inputB}
                  onChange={(e) => setInputB(e.target.checked)}
                />
              </div>
            </th>
            <th className="border border-[#5e5e5e] p-2 text-center">
              {t('takeUmbrella')}
            </th>
          </tr>
        </thead>
        <tbody>
          {truthTable.map((row, index) => (
            <tr
              key={row.id}
              className={index === currentRow ? 'bg-blue-500/30' : ''}
            >
              <td className="border border-[#5e5e5e] p-2 text-center">
                {row.a ? '1' : '0'}
              </td>
              <td className="border border-[#5e5e5e] p-2 text-center">
                {row.b ? '1' : '0'}
              </td>
              <td className="border border-[#5e5e5e] p-2 text-center">
                {row.output ? '1' : '0'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
