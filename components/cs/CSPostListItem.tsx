import { skewOnHover } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export default function CSPostListItem({
  href,
  title,
  description,
}: {
  href?: string;
  title: string;
  description: string;
}) {
  const t = useTranslations('Curriculum');

  return (
    <Container href={href}>
      <h3
        className={clsx(
          'm-0 p-0 font-semibold',
          href && skewOnHover,
          href ? 'text-white' : 'text-gray-500',
        )}
      >
        {!href && (
          <span className="bg-gray-700 mr-1 px-1 text-xs text-white relative -top-[1px]">
            {t('comingSoon')}
          </span>
        )}
        {title}
      </h3>
      <p
        className={clsx(
          'm-0 p-0 font-light',
          href && skewOnHover,
          href ? 'text-[var(--tw-prose-body)]' : 'text-gray-500',
        )}
      >
        {description}
      </p>
    </Container>
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
