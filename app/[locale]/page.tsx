import cs from '@/app/[locale]/(mdx)/cs/assets/chasing.png';
import PostList from '@/app/[locale]/components/content/PostList';
import Tile from '@/app/[locale]/components/ui/Tile';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import Link from 'next/link';
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
    <div className="max-w-2xl mx-auto my-24 px-4 flex flex-col gap-16">
      <div className="relative w-full aspect-square mx-auto">
        <Image src={me} alt="me" className="object-cover w-full h-full" />
        <div className="flex flex-col gap-2 absolute bottom-5 left-5">
          <Link
            href="https://github.com/yeolyi/blog"
            className="block text-white text-2xl font-semibold bg-black w-fit hover:bg-white hover:text-black"
          >
            GitHub
          </Link>
          <Link
            href="https://www.instagram.com/yeol.dev"
            className="block text-white text-2xl font-semibold bg-black w-fit hover:bg-white hover:text-black"
          >
            Instagram
          </Link>
        </div>
      </div>

      <p className="prose prose-invert break-keep">
        {t.rich('bio', {
          snuLink: (chunks) => (
            <Link
              href="https://cse.snu.ac.kr"
              className="text-white hover:text-black hover:bg-white underline active:text-black active:bg-white"
            >
              {chunks}
            </Link>
          ),
          kakaoLink: (chunks) => (
            <Link
              href="https://kakaocorp.com"
              className="text-white hover:text-black hover:bg-white underline active:text-black active:bg-white"
            >
              {chunks}
            </Link>
          ),
          instagramLink: (chunks) => (
            <Link
              href="https://www.instagram.com/yeol.dev"
              className="text-white hover:text-black hover:bg-white underline active:text-black active:bg-white"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      <div>
        <h2 className="text-2xl font-bold mb-[1em] text-white">{t('posts')}</h2>
        <PostList />
      </div>

      <Tile>
        <Tile.Item title="만들면서 배우는 컴퓨터공학" href="/cs">
          <Image
            src={cs}
            alt="cs"
            className="w-[512px] max-w-full aspect-video object-cover"
          />
        </Tile.Item>
      </Tile>
    </div>
  );
}
