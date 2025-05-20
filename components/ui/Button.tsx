import { type Theme, themeMap } from '@/components/ui/theme';
import clsx from 'clsx';
import type { LucideProps } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const Button = ({
  theme,
  onClick,
  children,
  Icon,
  className,
  ...props
}: {
  theme: Theme;
  onClick?: () => void;
  Icon: (props: LucideProps) => ReactNode;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed',
        themeMap[theme],
        className,
      )}
      {...props}
    >
      <Icon size={16} />
      {children}
    </button>
  );
};

export default Button;
