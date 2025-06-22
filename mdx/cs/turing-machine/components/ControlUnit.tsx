'use client';

import Button from '@/components/ui/Button';
import type {
  Rules,
  State,
  TapeSymbol,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';
import clsx from 'clsx';
import { Check, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from 'react';

const TableCell = ({
  children,
  header,
}: {
  children: ReactNode;
  header?: boolean;
}) => (
  <td
    className={clsx(
      'p-2 border border-stone-700 font-mono whitespace-nowrap',
      header && 'bg-stone-900 text-sm',
    )}
  >
    {children}
  </td>
);

export const ControlUnit = ({
  rules,
  currentState,
  currentSymbol,
  editable,
  rulesCsv,
  onRulesCsvChange,
  isEditing,
  setIsEditing,
}: {
  rules: Rules;
  currentState: State;
  currentSymbol: TapeSymbol;
  editable?: boolean;
  rulesCsv: string;
  onRulesCsvChange: (newCsv: string) => void;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [editedCsv, setEditedCsv] = useState(rulesCsv.trim());

  const handleApply = () => {
    onRulesCsvChange(editedCsv);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCsv(rulesCsv.trim());
    setIsEditing(false);
  };

  return (
    <div className="mt-6">
      <div className="flex mb-2 w-full items-center justify-between">
        <p className="text-md font-semibold">제어 장치</p>
        <div className="flex items-center gap-2">
          {editable && !isEditing && (
            <Button
              bg="gray"
              Icon={Pencil}
              onClick={() => setIsEditing(true)}
            />
          )}
          {hasScroll && !isEditing && (
            <Button
              bg="gray"
              Icon={isExpanded ? ChevronUp : ChevronDown}
              onClick={() => setIsExpanded((prev) => !prev)}
            />
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full h-48 p-2 font-mono text-sm bg-stone-900 border border-stone-700 rounded-none focus:outline-none focus:ring-1 focus:ring-green-500"
            value={editedCsv}
            onChange={(e) => setEditedCsv(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2">
            <Button bg="green" Icon={Check} onClick={handleApply} />
            <Button bg="gray" Icon={X} onClick={handleCancel} />
          </div>
        </div>
      ) : (
        <div
          className={clsx('overflow-auto', !isExpanded && 'h-fit max-h-72')}
          style={{ scrollbarGutter: 'stable' }}
          ref={(ref) => {
            if (ref) {
              setHasScroll(ref.scrollHeight > 288);
            }
          }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <TableCell header>현재 상태</TableCell>
                <TableCell header>읽은 기호</TableCell>
                <TableCell header>다음 상태</TableCell>
                <TableCell header>쓸 기호</TableCell>
                <TableCell header>이동</TableCell>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rules).flatMap(([state, transitions]) =>
                Object.entries(transitions).map(
                  ([symbol, rule]) =>
                    rule && (
                      <tr
                        key={`${state}-${symbol}`}
                        className={clsx({
                          'bg-stone-400 text-black':
                            state === currentState &&
                            symbol === currentSymbol &&
                            currentState !== 'q-halt',
                        })}
                      >
                        <TableCell>{state}</TableCell>
                        <TableCell>{symbol}</TableCell>
                        <TableCell>{rule.newState}</TableCell>
                        <TableCell>{rule.newSymbol}</TableCell>
                        <TableCell>{rule.direction}</TableCell>
                      </tr>
                    ),
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
