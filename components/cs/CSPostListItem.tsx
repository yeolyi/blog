import { skewOnHover } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { CornerDownRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

export default function CSPostListItem(
  props:
    | {
        href: string;
        title: string;
        description: string;
        date?: string;
        children: React.ReactNode;
      }
    | {
        title: string;
        description: string;
        date?: string;
      },
) {
  const t = useTranslations('Curriculum');
  const formatter = useFormatter();

  const { title, description, date } = props;

  // TODO: 이게 최선?
  const href = 'href' in props ? props.href : undefined;
  const children = 'children' in props ? props.children : null;

  return (
    <div className="flex flex-col gap-2">
      <Container href={href}>
        <h3
          className={clsx(
            'm-0 p-0 font-semibold break-keep',
            href && skewOnHover,
            href ? 'text-white' : 'text-stone-500',
          )}
        >
          {!href && (
            <span
              className={clsx(
                'bg-stone-700 mr-1 px-1 text-white relative -top-[1px]',
                date ? 'text-sm' : 'text-xs',
              )}
            >
              {date
                ? `⏰ ${formatter.relativeTime(new Date(date), new Date())}`
                : t('comingSoon')}
            </span>
          )}
          {title}
        </h3>
        <p
          className={clsx(
            'm-0 p-0 font-light',
            href && skewOnHover,
            href ? 'text-[var(--tw-prose-body)]' : 'text-stone-500',
          )}
        >
          {description}
          {'  '}
          {date && href && (
            <span className="text-stone-500">
              {` ${t('dateFormat', { date: new Date(date) })}`}
            </span>
          )}
        </p>
      </Container>
      {children && (
        <div className="w-full flex gap-2 pl-1">
          <CornerDownRight
            size={24}
            className="text-stone-400"
            strokeWidth={1.6}
          />
          <div className="pt-1 max-w-[384px] w-full">{children}</div>
        </div>
      )}
    </div>
  );
}

const Container = ({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) => {
  if (href) {
    return (
      <Link href={href} className="not-prose w-fit block text-base group">
        {children}
      </Link>
    );
  }
  return (
    <div className="not-prose w-fit block text-base group">{children}</div>
  );
};
