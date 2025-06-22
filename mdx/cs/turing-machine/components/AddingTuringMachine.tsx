'use client';

import { Tape } from '@/mdx/cs/turing-machine/components/Tape';
import {
  type TapeSymbol,
  TuringMachineProvider,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';
import { useTuringMachine } from '@/mdx/cs/turing-machine/hooks/useTuringMachine';
import { useEffect } from 'react';

const rulesCsv = `
q0,0,q0,0,R
q0,1,q0,1,R
q0,_,q1,_,R
q1,0,q1,0,R
q1,1,q1,1,R
q1,_,q2,_,L
q2,0,q2,1,L
q2,1,q3,0,L
q2,_,q5,_,R
q3,0,q3,0,L
q3,1,q3,1,L
q3,_,q4,_,L
q4,0,q0,1,R
q4,1,q4,0,L
q4,_,q0,1,R
q5,0,q5,_,R
q5,1,q5,_,R
q5,_,q_halt,_,N
`;

const initialTape = Array.from<TapeSymbol>('011_1_');
const initialHeadIdx = 1;

const AddingTuringMachineContent = () => {
  const { tape, headIdx, state, play, reset, isHalted } = useTuringMachine(
    initialTape,
    initialHeadIdx,
    rulesCsv,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      play();
    }, 2000);
    return () => clearTimeout(timer);
  }, [play]);

  useEffect(() => {
    if (isHalted) {
      const timer = setTimeout(() => {
        reset();
        play();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHalted, reset, play]);

  return <Tape tape={tape} head={headIdx} currentState={state} />;
};

export default function AddingTuringMachine() {
  return (
    <div className="not-prose">
      <TuringMachineProvider>
        <AddingTuringMachineContent />
      </TuringMachineProvider>
    </div>
  );
}
