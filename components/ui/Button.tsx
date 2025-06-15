import { type Bg, bgMap } from '@/components/ui/theme';
import clsx from 'clsx';
import { Loader2, type LucideProps } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useHaptic } from 'use-haptic';

// https://github.com/radix-ui/primitives/issues/892
const Button = ({
  bg: theme,
  onClick,
  children,
  Icon,
  className,
  isLoading,
  ...props
}: {
  bg: Bg;
  onClick?: () => void;
  Icon: (props: LucideProps) => ReactNode;
  isLoading?: boolean;
  ref?: React.RefObject<HTMLButtonElement | null>;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { triggerHaptic } = useHaptic();

  return (
    <button
      onClick={(e) => {
        triggerHaptic();
        onClick?.(e);
      }}
      className={clsx(
        'flex text-base font-normal items-center gap-2 cursor-pointer disabled:cursor-not-allowed text-white select-none',
        bgMap[theme],
        className,
        children ? 'px-4 py-2' : 'p-3',
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Icon size={16} />
      )}
      {children}
    </button>
  );
};

export default Button;
