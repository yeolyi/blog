'use client';
import { ScrollableTable } from '@/app/[locale]/components/ui/scrollable-area';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useId, useState } from 'react';

// 커스텀 체크박스 컴포넌트
interface CustomCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

function CustomCheckbox({
  checked,
  onCheckedChange,
  id,
  disabled = false,
  size = 'md',
}: CustomCheckboxProps) {
  const sizeClasses =
    size === 'sm'
      ? {
          root: 'h-5 w-5',
          indicator: 'h-3 w-3',
        }
      : {
          root: 'h-6 w-6',
          indicator: 'h-4 w-4',
        };

  return (
    <Checkbox.Root
      className={`flex ${sizeClasses.root} appearance-none items-center justify-center rounded-none bg-black border border-[#5e5e5e] ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 cursor-pointer'
      }`}
      checked={checked}
      onCheckedChange={(checked) =>
        !disabled && onCheckedChange(checked === true)
      }
      id={id}
      disabled={disabled}
    >
      <Checkbox.Indicator>
        <div
          className={`${sizeClasses.indicator} text-white flex items-center justify-center`}
        >
          ✓
        </div>
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
}

interface InputCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  label: string;
  disabled?: boolean;
}

function InputCheckbox({
  checked,
  onCheckedChange,
  id,
  label,
  disabled = false,
}: InputCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <CustomCheckbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`text-sm font-medium ${disabled ? 'text-gray-500' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}

// 테이블 헤더 체크박스 컴포넌트
interface HeaderCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  label: string;
}

function HeaderCheckbox({
  checked,
  onCheckedChange,
  id,
  label,
}: HeaderCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <CustomCheckbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}
        size="sm"
      />
      <span>{label}</span>
    </div>
  );
}

// 테이블 헤더 셀 컴포넌트
interface TableHeaderCellProps {
  children: React.ReactNode;
}

function TableHeaderCell({ children }: TableHeaderCellProps) {
  return (
    <th className="border border-[#5e5e5e] px-4 py-2 text-center whitespace-nowrap">
      <div className="flex justify-center items-center">{children}</div>
    </th>
  );
}

interface TruthTableRowProps {
  inputA: string;
  inputB?: string;
  output: string;
  isNotGate?: boolean;
  isActive?: boolean;
  columns?: React.ReactNode[];
}

function TruthTableRow({
  inputA,
  inputB,
  output,
  isNotGate = false,
  isActive = false,
  columns = [],
}: TruthTableRowProps) {
  return (
    <tr
      className={
        isActive ? (output === '1' ? 'bg-blue-500/30' : 'bg-red-500/30') : ''
      }
    >
      <td className="border border-[#5e5e5e] px-2 py-1 text-center whitespace-nowrap">
        {inputA}
      </td>
      {!isNotGate && (
        <td className="border border-[#5e5e5e] px-2 py-1 text-center whitespace-nowrap">
          {inputB}
        </td>
      )}
      {columns.map((column, idx) => (
        <td
          key={`column-${idx}-${column}`}
          className="border border-[#5e5e5e] px-2 py-1 text-center whitespace-nowrap"
        >
          {column}
        </td>
      ))}
      <td className="border border-[#5e5e5e] px-2 py-1 text-center whitespace-nowrap">
        {output}
      </td>
    </tr>
  );
}

interface TruthTableGateProps {
  truthTable: boolean[]; // [A=0 B=0, A=0 B=1, A=1 B=0, A=1 B=1]의 결과
  inputALabel: string;
  inputBLabel: string;
  outputLabel: string;
}

export function TruthTableGate({
  truthTable,
  inputALabel,
  inputBLabel,
  outputLabel,
}: TruthTableGateProps) {
  const id = useId();
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  // 현재 활성화된 행의 인덱스 계산
  const activeRowIndex = (inputA ? 2 : 0) + (inputB ? 1 : 0);

  return (
    <div className="not-prose bg-black text-white flex flex-col gap-3 w-full">
      {/* 진리표 섹션 */}
      <ScrollableTable>
        <table className="border-collapse">
          <thead className="text-sm font-semibold">
            <tr>
              <TableHeaderCell>
                <HeaderCheckbox
                  checked={inputA}
                  onCheckedChange={setInputA}
                  id={`${id}-header-inputA`}
                  label={inputALabel}
                />
              </TableHeaderCell>
              <TableHeaderCell>
                <HeaderCheckbox
                  checked={inputB}
                  onCheckedChange={setInputB}
                  id={`${id}-header-inputB`}
                  label={inputBLabel}
                />
              </TableHeaderCell>
              <TableHeaderCell>{outputLabel}</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="font-mono text-base">
            <TruthTableRow
              inputA="0"
              inputB="0"
              output={truthTable[0] ? '1' : '0'}
              isActive={activeRowIndex === 0}
            />
            <TruthTableRow
              inputA="0"
              inputB="1"
              output={truthTable[1] ? '1' : '0'}
              isActive={activeRowIndex === 1}
            />
            <TruthTableRow
              inputA="1"
              inputB="0"
              output={truthTable[2] ? '1' : '0'}
              isActive={activeRowIndex === 2}
            />
            <TruthTableRow
              inputA="1"
              inputB="1"
              output={truthTable[3] ? '1' : '0'}
              isActive={activeRowIndex === 3}
            />
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
}

interface NotGateProps {
  inputLabel: string;
  outputLabel: string;
}

export function NotGate({ inputLabel, outputLabel }: NotGateProps) {
  const id = useId();
  const [input, setInput] = useState(false);

  // 현재 활성화된 행의 인덱스 계산
  const activeRowIndex = input ? 1 : 0;

  return (
    <div className="not-prose bg-black text-white flex flex-col gap-3 w-full">
      {/* 진리표 섹션 */}
      <ScrollableTable>
        <table className="border-collapse">
          <thead className="text-sm font-semibold">
            <tr>
              <TableHeaderCell>
                <HeaderCheckbox
                  checked={input}
                  onCheckedChange={setInput}
                  id={`${id}-header-input`}
                  label={inputLabel}
                />
              </TableHeaderCell>
              <TableHeaderCell>{outputLabel}</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="font-mono text-base">
            <TruthTableRow
              inputA="0"
              output="1"
              isNotGate={true}
              isActive={activeRowIndex === 0}
            />
            <TruthTableRow
              inputA="1"
              output="0"
              isNotGate={true}
              isActive={activeRowIndex === 1}
            />
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
}

interface ComplexLogicGateProps {
  inputALabel: string;
  inputBLabel: string;
}

export function ComplexLogicGate({
  inputALabel,
  inputBLabel,
}: ComplexLogicGateProps) {
  const id = useId();
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  // 현재 상태에 해당하는 row 인덱스
  const activeRowIndex = (inputA ? 2 : 0) + (inputB ? 1 : 0);

  return (
    <div className="not-prose bg-black text-white flex flex-col gap-3 w-full">
      <ScrollableTable>
        <table className="border-collapse">
          <thead className="text-sm font-semibold">
            <tr>
              <TableHeaderCell>
                <HeaderCheckbox
                  checked={inputA}
                  onCheckedChange={setInputA}
                  id={`${id}-complex-header-inputA`}
                  label={inputALabel}
                />
              </TableHeaderCell>
              <TableHeaderCell>
                <HeaderCheckbox
                  checked={inputB}
                  onCheckedChange={setInputB}
                  id={`${id}-complex-header-inputB`}
                  label={inputBLabel}
                />
              </TableHeaderCell>
              <TableHeaderCell>NOT {inputALabel}</TableHeaderCell>
              <TableHeaderCell>NOT {inputBLabel}</TableHeaderCell>
              <TableHeaderCell>
                (NOT {inputALabel}) AND {inputBLabel}
              </TableHeaderCell>
              <TableHeaderCell>
                {inputALabel} AND (NOT {inputBLabel})
              </TableHeaderCell>
              <TableHeaderCell>
                ((NOT A) AND (NOT B)) OR (A AND B)
              </TableHeaderCell>
            </tr>
          </thead>
          <tbody className="font-mono text-base">
            {/* A=0, B=0 */}
            <TruthTableRow
              inputA="0"
              inputB="0"
              output="1"
              isActive={activeRowIndex === 0}
              columns={[
                '1', // NOT A
                '1', // NOT B
                '0', // (NOT A) AND B
                '0', // A AND (NOT B)
              ]}
            />

            {/* A=0, B=1 */}
            <TruthTableRow
              inputA="0"
              inputB="1"
              output="0"
              isActive={activeRowIndex === 1}
              columns={[
                '1', // NOT A
                '0', // NOT B
                '1', // (NOT A) AND B
                '0', // A AND (NOT B)
              ]}
            />

            {/* A=1, B=0 */}
            <TruthTableRow
              inputA="1"
              inputB="0"
              output="0"
              isActive={activeRowIndex === 2}
              columns={[
                '0', // NOT A
                '1', // NOT B
                '0', // (NOT A) AND B
                '1', // A AND (NOT B)
              ]}
            />

            {/* A=1, B=1 */}
            <TruthTableRow
              inputA="1"
              inputB="1"
              output="1"
              isActive={activeRowIndex === 3}
              columns={[
                '0', // NOT A
                '0', // NOT B
                '0', // (NOT A) AND B
                '0', // A AND (NOT B)
              ]}
            />
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
}
