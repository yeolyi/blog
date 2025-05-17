import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const themeMap = {
  green: {
    backgroundColor: 'bg-green-500',
    color: 'text-white',
  },
  gray: {
    backgroundColor: 'bg-gray-400',
    color: 'text-white',
  },
};

const Button = ({
  theme,
  onClick,
  icon,
  children,
}: {
  theme: keyof typeof themeMap;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { backgroundColor, color } = themeMap[theme];

  return (
    <button
      onClick={onClick}
      className={clsx(
        'py-2 px-4 border-none cursor-pointer hover:bg-black hover:text-white',
        icon && 'flex items-center gap-2',
        backgroundColor,
        color,
      )}
      type="button"
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
