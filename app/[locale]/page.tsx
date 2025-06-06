import PostList from '@/components/PostList';
import { layerBg } from '@/components/ui/theme';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
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
    <div className="max-w-2xl mx-auto my-24 px-4 flex flex-col gap-12">
      <Image
        src={me}
        alt="me"
        className="object-cover w-full h-full aspect-square"
        draggable={false}
      />

      <p className="prose prose-invert break-keep">
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

      <div>
        <h2 className="text-2xl font-bold mb-[1em] text-white">{t('posts')}</h2>
        <PostList />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-[1em] text-white">
          {t('series')}
        </h2>
        <div className="flex gap-8 flex-col">
          <SeriesCard href="/cs" src={cs} title={t('curriculum')} />
          {locale === 'ko' && (
            <SeriesCard
              href="/react"
              src={react}
              title={t('react')}
              imgClassName="object-top"
            />
          )}
        </div>
      </div>
    </div>
  );
}

const SeriesCard = ({
  href,
  imgClassName,
  src,
  title,
}: {
  imgClassName?: string;
  href: string;
  src: StaticImageData;
  title: string;
}) => (
  <Link
    href={href}
    className="cursor-pointer relative w-fit flex flex-col group"
    draggable={false}
  >
    <Image
      src={src}
      alt={title}
      className={clsx(
        'w-[512px] max-w-full aspect-video object-cover',
        imgClassName,
      )}
      draggable={false}
    />
    <h3
      className={clsx(
        'text-xl font-semibold text-white p-2 group-hover:tracking-wide group-active:tracking-wider transition-all ease-in-out duration-200',
        layerBg,
      )}
    >
      {title}
    </h3>
  </Link>
);
