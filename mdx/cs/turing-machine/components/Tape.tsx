import type {
  State,
  TapeSymbol,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';
import clsx from 'clsx';

export const Tape = ({
  tape,
  head,
  currentState,
}: {
  tape: TapeSymbol[];
  head: number;
  currentState: State;
}) => {
  return (
    <div>
      <p className="mb-2 text-md font-semibold">테이프</p>
      <div className="relative flex flex-wrap">
        {tape.map((cell, idx) => (
          <div
            key={idx}
            className={clsx(
              'relative w-12 h-12 border border-stone-700 flex items-center justify-center text-xl font-mono shrink-0 mb-4',
              {
                'bg-stone-400 text-black':
                  idx === head && currentState !== 'q_halt',
                'bg-green-500 text-black':
                  idx === head && currentState === 'q_halt',
              },
            )}
          >
            {cell}
          </div>
        ))}
        <p className="absolute -bottom-2 text-sm" style={{ left: 48 * head }}>
          ▲ 헤드
        </p>
      </div>
    </div>
  );
};
