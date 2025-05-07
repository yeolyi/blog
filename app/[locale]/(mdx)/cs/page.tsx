import CurriculumSection from '@/app/[locale]/(mdx)/cs/components/CurriculumSection';
import EmailSubscribe from '@/app/[locale]/(mdx)/cs/components/EmailSubscribe';
import chapter1 from '@/app/[locale]/assets/chapter1.png';
import chapter2 from '@/app/[locale]/assets/chapter2.png';
import chapter3 from '@/app/[locale]/assets/chapter3.png';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import chasing from './assets/chasing.png';

export const metadata: Metadata = {
  title: '만들면서 배우는 컴퓨터공학',
  description: '작은 것들이 모여 컴퓨터가 만들어지는 과정을 함께 따라가봐요!',
  keywords: [
    '논리설계',
    '컴퓨터 구조',
    '자료구조',
    '알고리즘',
    '운영체제',
    '네트워크',
  ],
};

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
    <>
      <h1 className="text-3xl font-bold mb-[1em] text-white break-keep">
        {t('curriculum')}
      </h1>
      <Image src={chasing} alt="컴퓨터 이미지" className="w-full mb-8" />
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
      <div className="border-t border-white/20 my-12" />

      {curriculumData.map((part) => (
        <CurriculumSection key={part.id} {...part} />
      ))}
    </>
  );
}

const curriculumDataRaw: PartType[] = [
  {
    id: 'hardware',
    titleKey: 'part1Title',
    image: chapter1,
    posts: [
      {
        titleKey: 'hw1Title',
        descriptionKey: 'hw1Description',
        isPublished: false,
        // slug: '/cs/zero-and-one',
      },
      {
        titleKey: 'hw2Title',
        descriptionKey: 'hw2Description',
        isPublished: false,
      },
      {
        titleKey: 'hw3Title',
        descriptionKey: 'hw3Description',
        isPublished: false,
      },
      {
        titleKey: 'hw4Title',
        descriptionKey: 'hw4Description',
        isPublished: false,
      },
      {
        titleKey: 'hw5Title',
        descriptionKey: 'hw5Description',
        isPublished: false,
      },
      {
        titleKey: 'hw6Title',
        descriptionKey: 'hw6Description',
        isPublished: false,
      },
      {
        titleKey: 'hw7Title',
        descriptionKey: 'hw7Description',
        isPublished: false,
      },
      {
        titleKey: 'hw8Title',
        descriptionKey: 'hw8Description',
        isPublished: false,
      },
    ],
  },
  {
    id: 'data-structures',
    titleKey: 'part2Title',
    image: chapter2,
    posts: [
      {
        titleKey: 'ds1Title',
        descriptionKey: 'ds1Description',
        isPublished: false,
      },
      {
        titleKey: 'ds2Title',
        descriptionKey: 'ds2Description',
        isPublished: false,
      },
      {
        titleKey: 'ds3Title',
        descriptionKey: 'ds3Description',
        isPublished: false,
      },
      {
        titleKey: 'ds4Title',
        descriptionKey: 'ds4Description',
        isPublished: false,
      },
      {
        titleKey: 'ds5Title',
        descriptionKey: 'ds5Description',
        isPublished: false,
      },
      {
        titleKey: 'ds6Title',
        descriptionKey: 'ds6Description',
        isPublished: false,
      },
      {
        titleKey: 'ds7Title',
        descriptionKey: 'ds7Description',
        isPublished: false,
      },
    ],
  },
  {
    id: 'os-network',
    titleKey: 'part3Title',
    image: chapter3,
    posts: [
      {
        titleKey: 'os1Title',
        descriptionKey: 'os1Description',
        isPublished: false,
      },
      {
        titleKey: 'os2Title',
        descriptionKey: 'os2Description',
        isPublished: false,
      },
      {
        titleKey: 'os3Title',
        descriptionKey: 'os3Description',
        isPublished: false,
      },
      {
        titleKey: 'os4Title',
        descriptionKey: 'os4Description',
        isPublished: false,
      },
      {
        titleKey: 'os5Title',
        descriptionKey: 'os5Description',
        isPublished: false,
      },
      {
        titleKey: 'os6Title',
        descriptionKey: 'os6Description',
        isPublished: false,
      },
    ],
  },
  {
    id: 'appendix',
    titleKey: 'appendixTitle',
    posts: [
      {
        titleKey: 'appendix1Title',
        isPublished: false,
      },
    ],
  },
];
