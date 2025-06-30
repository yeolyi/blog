'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import clsx from 'clsx';
import { useId, useState } from 'react';

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

  description?: string;
};

export default function TruthTable({
  labels,
  data,
  description,
}: TruthTableGateProps) {
  const id = useId();

  const inputLabels = labels.filter((l) => l.type === 'input');

  const [inputs, setInputs] = useState<boolean[]>(() => {
    const inputs = Array(inputLabels.length).fill(false);
    return inputs;
  });

  const matchingRowIndex = data.findIndex((row) => {
    return inputs.every((val, idx) => val === row[idx]);
  });

  const handleCheckedChange = (index: number) => (checked: boolean) => {
    const newInputs = [...inputs];
    newInputs[index] = checked;
    setInputs(newInputs);
  };

  return (
    <Card className="w-fit max-w-full">
      <CardHeader>
        <CardTitle>진리표</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table className="not-prose w-fit mx-auto">
          <TableHeader>
            <TableRow>
              {labels.map((labelObj, index) => (
                <TableHead
                  key={`header-${labelObj.label}-${index}`}
                  className="text-center"
                >
                  {labelObj.type === 'input' ? (
                    <div className="flex items-center gap-2 justify-center px-4">
                      <Label htmlFor={`${id}-${index}`}>{labelObj.label}</Label>
                      <Checkbox
                        id={`${id}-${index}`}
                        checked={inputs[index]}
                        onCheckedChange={handleCheckedChange(index)}
                        aria-label={`Toggle ${labelObj.label}`}
                      />
                    </div>
                  ) : (
                    <span className="px-4">{labelObj.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIdx) => (
              <TableRow key={`row-${rowIdx}`}>
                {row.map((cell, colIdx) => (
                  <TableCell
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={clsx(
                      'text-center',
                      rowIdx === matchingRowIndex &&
                        (labels[colIdx].type === 'output'
                          ? cell
                            ? 'bg-success text-success-foreground'
                            : 'bg-fail text-fail-foreground'
                          : ''),
                    )}
                  >
                    {cell ? '1' : '0'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
