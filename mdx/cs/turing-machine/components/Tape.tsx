import type {
  State,
  TapeSymbol,
} from '@/mdx/cs/turing-machine/hooks/turingMachineStore';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export const Tape = ({
  tape,
  head,
  currentState,
}: {
  tape: TapeSymbol[];
  head: number;
  currentState: State;
}) => {
  const t = useTranslations('TuringMachine.Tape');
  return (
    <div>
      <p className="mb-2 text-md font-semibold">{t('title')}</p>
      <div className="relative flex flex-wrap">
        {tape.map((cell, idx) => (
          <div
            key={idx}
            className={clsx(
              'relative w-12 h-12 border border-stone-700 flex items-center justify-center text-xl font-mono shrink-0 mb-6',
              {
                'bg-stone-400 text-black':
                  idx === head && currentState !== 'q_halt',
                'bg-green-500 text-black':
                  idx === head && currentState === 'q_halt',
              },
            )}
          >
            {cell}
            {idx === head && (
              <p className="absolute -bottom-0 translate-y-full text-sm text-white">
                {t('head')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
