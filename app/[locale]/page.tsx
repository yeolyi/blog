import PostList from '@/components/PostList';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import cs from './assets/cs.gif';
import me from './assets/me.jpg';
import react from './assets/react.png';

export type PostType = {
  titleKey: string;
  title?: string;
  descriptionKey?: string;
  description?: string;
} & (
  | {
      isPublished: false;
    }
  | {
      isPublished: true;
      slug: string;
    }
);

export type PartType = {
  id: string;
  titleKey: string;
  title?: string;
  image?: StaticImageData;
  posts: PostType[];
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');

  return (
    <div className="mx-auto mt-4 mb-24 px-4 prose prose-stone dark:prose-invert ">
      <Image
        src={me}
        alt="me"
        className="object-cover w-full h-full aspect-square not-prose"
        draggable={false}
      />

      <p className="break-keep">
        {t.rich('bio', {
          snuLink: (chunks) => (
            <Link href="https://cse.snu.ac.kr">{chunks}</Link>
          ),
          kakaoLink: (chunks) => (
            <Link href="https://kakaocorp.com">{chunks}</Link>
          ),
          instagramLink: (chunks) => (
            <Link href="https://www.instagram.com/yeol.dev">{chunks}</Link>
          ),
        })}
      </p>

      <h2>{t('posts')}</h2>
      <PostList />

      <h2>{t('series')}</h2>

      <div className="not-prose flex gap-8 flex-col">
        <SeriesCard
          href="/cs"
          src={cs}
          title={t('curriculum')}
          description={t('curriculumDescription')}
          buttonText={t('viewSeries')}
        />
        {locale === 'ko' && (
          <SeriesCard
            href="/react"
            src={react}
            title={t('react')}
            description={t('reactDescription')}
            buttonText={t('viewSeries')}
            imgClassName="object-left"
          />
        )}
      </div>
    </div>
  );
}

const SeriesCard = ({
  href,
  imgClassName,
  src,
  title,
  description,
  buttonText,
}: {
  imgClassName?: string;
  href: string;
  src: StaticImageData;
  title: string;
  description: string;
  buttonText: string;
}) => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardHeader>
    <Image
      src={src}
      alt={title}
      className={clsx('w-full h-[200px] object-cover', imgClassName)}
    />
    <CardFooter>
      <Button variant="default" className="ml-auto" asChild>
        <Link href={href}>
          {buttonText}
          <ArrowRight />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);
