import PostList from '@/app/[locale]/components/content/PostList';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import chasing from './assets/chasing.png';
import me from './assets/me.jpg';
import CurriculumSection from './components/content/CurriculumSection';
import EmailSubscribe from './components/content/EmailSubscribe';
import { curriculumDataRaw } from './data/curriculumData';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');
  const tCurriculum = await getTranslations('Curriculum');

  // 번역이 적용된 curriculumData 생성
  const curriculumData = curriculumDataRaw.map((part) => ({
    ...part,
    // @ts-expect-error 어떻게 고치지
    title: tCurriculum(part.titleKey),
    posts: part.posts.map((post) => ({
      ...post,
      // @ts-expect-error 어떻게 고치지
      title: tCurriculum(post.titleKey),
      description: post.descriptionKey
        ? // @ts-expect-error 어떻게 고치지
          tCurriculum(post.descriptionKey)
        : undefined,
    })),
  }));

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

      <div>
        <h2 className="text-2xl font-bold mb-[1em] text-white">
          {t('curriculum')}
        </h2>
        <Image
          src={chasing}
          alt="컴퓨터 이미지"
          className="w-full max-w-[512px] mb-8"
        />
        <p className="my-5 text-[oklch(87.2%_0.01_258.338)] text-base text-pretty break-keep">
          {t('curriculumIntro1')}
        </p>
        <p className="my-5 text-[oklch(87.2%_0.01_258.338)] text-base text-pretty break-keep">
          {t('curriculumIntro2')}
        </p>
        <p className="my-5 text-[oklch(87.2%_0.01_258.338)] text-base text-pretty break-keep">
          {t('curriculumIntro3')}
        </p>

        <EmailSubscribe />
        <div className="border-t border-white/20 my-8" />

        {curriculumData.map((part) => (
          <CurriculumSection key={part.id} {...part} />
        ))}
      </div>
    </div>
  );
}
