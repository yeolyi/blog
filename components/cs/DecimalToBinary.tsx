'use client';

import { Input } from '@/components/ui/Form';
import { layerBg } from '@/components/ui/theme';
import clsx from 'clsx';
import { useState } from 'react';

export default function DecimalToBinary() {
  const [val, setVal] = useState('5');

  const num = Number.parseInt(val);
  const binary = num.toString(2);
  const digits = binary.split('').map((bit, idx) => ({
    bit: Number(bit),
    power: binary.length - idx - 1,
    value: bit === '1' ? 2 ** (binary.length - idx - 1) : 0,
  }));

  const nonZeroDigits = digits.filter((d) => d.bit === 1);

  return (
    <div className="h-[200px] space-y-2">
      <Input
        type="number"
        value={val}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length > 10) {
            setVal(value.slice(0, 10));
          } else {
            setVal(value);
          }
        }}
        placeholder="십진수를 입력하세요"
      />
      <div className={clsx(layerBg, 'p-4')}>
        {!Number.isNaN(num) && (
          <div className="font-mono overflow-x-auto whitespace-nowrap">
            <span className="font-bold">
              {digits.map((d) => d.bit).join('')}
              <sub>2</sub>
            </span>

            <br />
            {' = '}

            {nonZeroDigits.map((d, idx) => (
              <span key={idx}>
                <span className="font-bold">{d.bit}</span>
                {' × '}
                <span>
                  2<sup>{d.power}</sup>
                </span>
                {idx < nonZeroDigits.length - 1 && ' + '}
              </span>
            ))}

            <br />
            {' = '}

            {nonZeroDigits.map((d, idx) => (
              <span key={idx}>
                <span>{d.value}</span>
                {idx < nonZeroDigits.length - 1 && (
                  <span className="mx-1">+</span>
                )}
              </span>
            ))}
            <span className="mx-2">=</span>
            <span className="font-bold">{num}</span>
            <sub>10</sub>
          </div>
        )}
      </div>
    </div>
  );
}
