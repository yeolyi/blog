import Link from 'next/link';
import me from './assets/me.jpg';
import Image from 'next/image';
import Post from '@/app/components/Post';
import Tile from '@/app/components/Tile';
import MemeTile from '@/app/components/MemeTile';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="max-w-[600px] mx-auto mt-24 mb-[30vh] px-4 flex flex-col gap-16">
      <div className="relative w-full aspect-square mx-auto">
        <Image src={me} alt="me" fill objectFit="cover" />
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
      <p className="text-xl font-semibold text-white break-keep">
        안녕하세요👋 개발자 이성열입니다.{' '}
        <Link
          href="https://cse.snu.ac.kr"
          className="text-white hover:text-black hover:bg-white"
        >
          서울대 컴공 홈페이지
        </Link>{' '}
        리뉴얼 프로젝트에 프론트엔드 개발자로 참여했습니다. 지금은 카카오에서{' '}
        <Link
          href="https://edoc.kakao.com/desktop"
          className="text-white hover:text-black hover:bg-white"
        >
          전자문서
        </Link>
        를 개발합니다.{' '}
        <Link
          href="https://www.instagram.com/yeol.dev"
          className="text-white hover:text-black hover:bg-white"
        >
          인스타그램
        </Link>
        에는 개발자를 위한 컨텐츠를 공유해요.
      </p>

      <Post>
        <Post.Item href="/post/sample" date="2024-01-01" title="샘플 글" />
        <Post.Item href="/post/sample" date="2024-01-01" title="샘플 글" />
        <Post.Item href="/post/sample" date="2024-01-01" title="샘플 글" />
      </Post>

      <Tile>
        <Suspense>
          <MemeTile />
        </Suspense>
      </Tile>
    </div>
  );
}
