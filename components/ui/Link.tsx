import { bgMap } from '@/components/ui/theme';
import { Link as NextLink } from '@/i18n/navigation';
import clsx from 'clsx';
import { Link2 } from 'lucide-react';
import type { Locale } from 'next-intl';
import type { AnchorHTMLAttributes } from 'react';

const Link = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  locale: Locale;
  onClick?: () => void;
  isLoading?: boolean;
  hideBackground?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <NextLink
      href={href}
      className={clsx(
        'flex items-center gap-2 cursor-pointer text-white w-fit text-base font-normal',
        bgMap.gray,
        className,
        children ? 'px-4 py-2' : 'p-3',
      )}
      {...props}
    >
      <Link2 size={16} />
      {children}
    </NextLink>
  );
};

export default Link;
