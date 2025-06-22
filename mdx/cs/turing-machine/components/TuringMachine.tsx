'use client';

import Button from '@/components/ui/Button';
import { layerBg } from '@/components/ui/theme';
import { ControlUnit } from '@/mdx/cs/turing-machine/components/ControlUnit';
import { Tape } from '@/mdx/cs/turing-machine/components/Tape';
import {
  type TapeSymbol,
  TuringMachineProvider,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';
import { useTuringMachine } from '@/mdx/cs/turing-machine/hooks/useTuringMachine';
import clsx from 'clsx';
import { Forward, Pause, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const TuringMachineContent = ({
  initialTape,
  initialHeadIdx,
  rulesCsv: initialRulesCsv,
  editable,
}: {
  initialTape: TapeSymbol[];
  initialHeadIdx: number;
  rulesCsv: string;
  editable?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rulesCsv, setRulesCsv] = useState(initialRulesCsv);
  const {
    tape,
    headIdx,
    state,
    isRunning,
    step,
    reset,
    play,
    pause,
    rules,
    isHalted,
  } = useTuringMachine(initialTape, initialHeadIdx, rulesCsv);

  const onRulesCsvChange = (newCsv: string) => {
    setRulesCsv(newCsv);
    setIsEditing(false);
  };

  const currentSymbol = tape[headIdx] || '_';

  return (
    <div className={clsx(layerBg, 'p-4 my-8 not-prose text-white')}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl font-semibold">튜링 머신</p>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button
              bg="gray"
              Icon={Pause}
              onClick={pause}
              disabled={isHalted || isEditing}
            />
          ) : (
            <Button
              bg="green"
              Icon={Play}
              onClick={play}
              disabled={isRunning || isHalted || isEditing}
            />
          )}

          <Button
            bg="gray"
            Icon={Forward}
            onClick={step}
            disabled={isRunning || isHalted || isEditing}
          />
          <Button
            bg="gray"
            Icon={RotateCcw}
            onClick={() => reset()}
            disabled={isRunning || isEditing}
          />
        </div>
      </div>

      <Tape tape={tape} head={headIdx} currentState={state} />
      <ControlUnit
        rules={rules}
        currentState={state}
        currentSymbol={currentSymbol}
        editable={editable}
        rulesCsv={rulesCsv}
        onRulesCsvChange={onRulesCsvChange}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default function TuringMachine({
  initialTape,
  initialHeadIdx,
  rulesCsv,
  editable,
}: {
  initialTape: TapeSymbol[];
  initialHeadIdx: number;
  rulesCsv: string;
  editable?: boolean;
}) {
  return (
    <TuringMachineProvider>
      <TuringMachineContent
        initialTape={initialTape}
        initialHeadIdx={initialHeadIdx}
        rulesCsv={rulesCsv}
        editable={editable}
      />
    </TuringMachineProvider>
  );
}
