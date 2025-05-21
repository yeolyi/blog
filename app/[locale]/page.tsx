import cs from '@/app/[locale]/(mdx)/cs/assets/chasing.png';
import PostList from '@/components/PostList';
import { Link } from '@/i18n/navigation';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import me from './assets/me.jpg';

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
        <Link
          href="/cs"
          className="group cursor-pointer relative w-fit flex flex-col"
          draggable={false}
        >
          <Image
            src={cs}
            alt="cs"
            className="w-[512px] max-w-full aspect-video object-cover"
            draggable={false}
          />
          <h3 className="text-xl font-semibold text-black bg-white p-2 group-hover:tracking-wide group-active:tracking-wider transition-all ease-in-out duration-200">
            {t('curriculum')}
          </h3>
        </Link>
      </div>
    </div>
  );
}
