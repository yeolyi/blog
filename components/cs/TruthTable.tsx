'use client';

import { Label } from '@/components/ui/Form';
import { failBg, layerBg, successBg } from '@/components/ui/theme';
import clsx from 'clsx';
import { useId, useState } from 'react';
import { Checkbox } from '../ui/Checkbox';

type LabelType = 'input' | 'output';

type TableLabel = {
  label: string;
  type: LabelType;
};

type TruthTableGateProps = {
  /**
   * 라벨 객체 배열. type이 'input'이면 입력, 'output'이면 출력
   * @example AND 게이트
   * [
   *   { label: 'A', type: 'input' },
   *   { label: 'B', type: 'input' },
   *   { label: 'A AND B', type: 'output' }
   * ]
   */
  labels: TableLabel[];

  /**
   * 진리표 데이터
   * @example AND 게이트 (2개 입력, 1개 출력)
   * [
   *   [false, false, false], // A=0, B=0, 출력=0
   *   [false, true, false],  // A=0, B=1, 출력=0
   *   [true, false, false],  // A=1, B=0, 출력=0
   *   [true, true, true]     // A=1, B=1, 출력=1
   * ]
   */
  data: boolean[][];
};

export default function TruthTable({ labels, data }: TruthTableGateProps) {
  const id = useId();

  const inputLabels = labels.filter((l) => l.type === 'input');

  const [inputs, setInputs] = useState<boolean[]>(
    Array(inputLabels.length).fill(false),
  );

  const matchingRowIndex = data.findIndex((row) => {
    return inputs.every((val, idx) => val === row[idx]);
  });

  const handleCheckedChange = (index: number) => (checked: boolean) => {
    const newInputs = [...inputs];
    newInputs[index] = checked;
    setInputs(newInputs);
  };

  return (
    <div className="overflow-x-auto">
      <table className={clsx('w-fit border-collapse not-prose', layerBg)}>
        <thead>
          <tr>
            {labels.map((labelObj, index) => (
              <th
                key={`header-${labelObj.label}-${index}`}
                className="p-3 text-left whitespace-nowrap"
              >
                {labelObj.type === 'input' ? (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${id}-${index}`}>{labelObj.label}</Label>
                    <Checkbox
                      id={`${id}-${index}`}
                      checked={inputs[index]}
                      onCheckedChange={handleCheckedChange(index)}
                      aria-label={`Toggle ${labelObj.label}`}
                    />
                  </div>
                ) : (
                  labelObj.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={`row-${rowIdx}`}
              className={clsx(
                rowIdx === matchingRowIndex &&
                  (row.at(-1) ? successBg : failBg),
              )}
            >
              {row.map((cell, colIdx) => (
                <td
                  key={`cell-${rowIdx}-${colIdx}`}
                  className="p-3 text-center"
                >
                  {cell ? '1' : '0'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
