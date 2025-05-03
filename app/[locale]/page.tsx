import PostList from '@/app/[locale]/components/Post';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import chasing from './assets/chasing.png';
import me from './assets/me.jpg';
import CurriculumSection from './components/CurriculumSection';
import EmailSubscribe from './components/EmailSubscribe';
import { curriculumData } from './data/curriculumData';

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

      <div className="prose prose-invert prose-h3:m-0 prose-h3:text-base">
        <h2>게시글</h2>
        <PostList />
      </div>

      <div className="prose prose-invert prose-a:m-0 prose-p:mt-0 prose-h4:text-base prose-h4:m-0 prose-h3:text-pretty prose-h4:text-pretty prose-h4:break-keep">
        <h2>만들면서 배우는 컴퓨터공학</h2>
        <Image
          src={chasing}
          alt="컴퓨터 이미지"
          className="w-full max-w-[512px]"
        />
        <p>
          컴퓨터공학을 배우며 느꼈던 경이로움을 나누고자 만든 시리즈입니다. 작은
          것들이 모여 컴퓨터가 만들어지는 과정을 함께 따라가봐요!
        </p>
        <p>
          알고리즘, 컴퓨터 구조, 운영체제, 네트워크 등 CS 지식들을 하나의 큰
          그림으로 연결합니다. 책이나 영상에서는 볼 수 없는 인터렉티브한 예제를
          통해 웹에서 바로 실습해볼 수 있도록 구성했습니다.
        </p>
        <p>
          CS 공부를 미루고 계신 개발자 분들, 컴퓨터가 어떻게 동작하는지 궁금하신
          분들... 그리고 마인크래프트에서{' '}
          <a
            href="https://www.youtube.com/watch?v=-BP7DhHTU-I"
            className="text-white underline"
          >
            컴퓨터
          </a>
          를 만들어보고 싶으신 분들 모두 환영합니다 🙌
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
