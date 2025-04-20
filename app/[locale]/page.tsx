import PostList from '@/app/[locale]/components/Post';
import { routing } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import me from './assets/me.jpg';

export default function Home() {
  const t = useTranslations('HomePage');

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
      <p className="text-xl font-normal text-white break-keep">
        {t.rich('bio', {
          snuLink: (chunks) => (
            <Link
              href="https://cse.snu.ac.kr"
              className="text-white hover:text-black hover:bg-white underline active:text-black active:bg-white"
            >
              {chunks}
            </Link>
          ),
          edocLink: (chunks) => (
            <Link
              href="https://edoc.kakao.com/desktop"
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

      <Suspense>
        <PostList />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
