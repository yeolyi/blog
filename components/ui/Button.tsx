import { type Bg, bgMap } from '@/components/ui/theme';
import clsx from 'clsx';
import { Loader2, type LucideProps } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const Button = ({
  bg: theme,
  onClick,
  children,
  Icon,
  className,
  isLoading,
  hideBackground,
  ...props
}: {
  bg: Bg;
  onClick?: () => void;
  Icon: (props: LucideProps) => ReactNode;
  isLoading?: boolean;
  hideBackground?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed active:opacity-60 text-white',
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
