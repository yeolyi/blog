'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ControlUnit } from '@/mdx/cs/turing-machine/components/ControlUnit';
import { Tape } from '@/mdx/cs/turing-machine/components/Tape';
import {
  type TapeSymbol,
  TuringMachineProvider,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';
import { useTuringMachine } from '@/mdx/cs/turing-machine/hooks/useTuringMachine';
import { Forward, Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('TuringMachine');
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
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => reset()}
            disabled={isRunning || isEditing}
          >
            <RotateCcw />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={step}
            disabled={isRunning || isHalted || isEditing}
          >
            <Forward />
          </Button>

          {isRunning ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={pause}
              disabled={isHalted || isEditing}
            >
              <Pause />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              onClick={play}
              disabled={isRunning || isHalted || isEditing}
            >
              <Play />
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
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
