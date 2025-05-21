import { type Bg, bgMap } from '@/components/ui/theme';
import { Link as _Link } from '@/i18n/navigation';
import clsx from 'clsx';
import type { LucideProps } from 'lucide-react';
import type { Locale } from 'next-intl';
import type { LinkProps } from 'next/link';
import type { ReactNode } from 'react';

const Link = ({
  theme,
  href,
  children,
  Icon,
  ...props
}: {
  locale: Locale;
  theme: Bg;
  href: string;
  Icon: (props: LucideProps) => ReactNode;
  children: ReactNode;
} & LinkProps) => {
  return (
    <_Link
      href={href}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80 w-fit',
        bgMap[theme],
      )}
      {...props}
    >
      <Icon size={16} />
      {children}
    </_Link>
  );
};

export default Link;
