import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { ArrowRightIcon } from 'lucide-react';
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
      <div className="flex flex-col gap-1">
        <h3
          className={clsx(
            'm-0 p-0 break-keep flex items-center gap-1',
            href ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {!href && <Badge variant="secondary">{t('comingSoon')}</Badge>}
          {title}
        </h3>
        <p
          className={clsx(
            'm-0 p-0 font-light text-base',
            href ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {description}
          {'  '}
        </p>
        {date && href && (
          <div className="flex items-center gap-6 justify-between">
            <span className="text-muted-foreground">
              {` ${t('dateFormat', { date: new Date(date) })}`}
            </span>
          </div>
        )}
      </div>
      {href && (
        <Button asChild variant="secondary" className="ml-auto">
          <Link href={href} className="no-underline">
            {t('viewPost')}
            <ArrowRightIcon />
          </Link>
        </Button>
      )}
      <Separator />
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
