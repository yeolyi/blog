import { opacityOnHover } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
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
    <div className={clsx('flex flex-col gap-4')}>
      {children}
      <Container href={href}>
        <h3
          className={clsx(
            'm-0 p-0 font-semibold text-xl break-keep',
            href && opacityOnHover,
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
            href && opacityOnHover,
            href ? 'text-[var(--tw-prose-body)]' : 'text-stone-500',
          )}
        >
          {description}
          {'  '}
        </p>
        {date && href && (
          <span className="text-stone-500">
            {` ${t('dateFormat', { date: new Date(date) })}`}
          </span>
        )}
      </Container>
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
      <Link
        href={href}
        className="not-prose w-fit flex flex-col gap-2 text-base group border-b border-stone-700 pb-4"
      >
        {children}
      </Link>
    );
  }
  return (
    <div className="not-prose w-fit block text-base group">{children}</div>
  );
};
