import PostList from '@/app/[locale]/components/Post';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import me from './assets/me.jpg';
import CurriculumSection from './components/CurriculumSection';
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
      <PostList />

      <div className="text-white prose">
        <h2 className="text-white">만들면서 배우는 컴퓨터공학</h2>
        <p>
          컴퓨터는 어떻게 0과 1만으로 세상을 바꿀 수 있었을까요? 컴퓨터 공학을
          배우며 스스로 느꼈던 경이로움을 나누고자 만든 시리즈입니다. 작고
          단순한 것들이 모여 컴퓨터가 만들어지는 과정을 함께 따라가봅시다!
        </p>
        <p>
          논리설계, 컴퓨터 구조, 자료구조, 알고리즘, 운영체제, 네트워크 등 CS
          지식들을 하나의 큰 그림으로 연결해보고자 합니다. 책이나 영상에서는 볼
          수 없는 인터렉티브 예제를 통해 직접 만들며 학습할 수 있도록
          구성했습니다.
        </p>
        <p>
          CS 공부를 미루고 계신 개발자 분들, 컴퓨터가 어떻게 동작하는지 궁금하신
          분들 ...그리고{' '}
          <a
            href="https://www.youtube.com/watch?v=3gBHXqnleU"
            className="text-white"
          >
            마인크래프트에서 컴퓨터
          </a>
          를 어떻게 만든건지 궁금하신 분들 모두 환영합니다.
        </p>

        <div className="mt-8">
          <h3 className="text-white text-xl font-semibold mb-4">커리큘럼</h3>

          {curriculumData.map((part) => (
            <CurriculumSection
              key={part.id}
              title={part.title}
              posts={part.posts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
