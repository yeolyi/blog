import Image from 'next/image';
import { Gallery } from '../components/gallery/Gallery';
import profile from '@/public/profile.jpg';
import { ReactNode } from 'react';
import {
  WideTile,
  Tile,
  TileProps,
  WideTileProps,
} from '@/components/gallery/Tile';
import {
  TopSection,
  Headline,
  Copy,
  SectionHeadline,
} from '@/components/Typography';
import { PostContainer, PostTile, PostTileProps } from '@/components/Post';
import { CserealBg } from '@/components/mainbg/CserealBg';
import InstaBg from '@/components/mainbg/InstaBg';

export default function Page() {
  return (
    <main>
      <Image
        src={profile}
        alt="어렸을 때 사진"
        className="block h-[calc(100vh-350px)] max-h-[calc(((100vw*9)/16))] min-h-[calc(((100vw*9)/16)*0.57)] w-full object-cover"
      />

      <TopSection>
        <Headline>이성열 yeolyi</Headline>
        <Copy>
          배우고 익히는 재미로 사는 프론트엔드 개발자입니다. 제가 배운 것과
          경험한 것들을 다듬어 여기에 공유해요.
        </Copy>
      </TopSection>

      <Section>
        <SectionHeadline className="horizontal-pad">
          <strong>프로젝트</strong>
        </SectionHeadline>

        <Gallery wide>
          {projectList.map((prop) => (
            <WideTile key={prop.href} {...prop} />
          ))}
        </Gallery>
      </Section>

      <Section>
        <div className="horizontal-pad">
          <SectionHeadline>
            <strong>자바스크립트 공부 기록.</strong> 예제 코드를 수정하고
            실행해보세요.
          </SectionHeadline>
        </div>

        <Gallery>
          {jsList.map((prop) => (
            <Tile key={prop.href} {...prop} />
          ))}
        </Gallery>
      </Section>

      <Section className="bg-lightgray">
        <SectionHeadline className="horizontal-pad">
          <strong>게시글</strong>
        </SectionHeadline>

        <PostContainer>
          {postList.map((prop) => (
            <PostTile key={prop.title} {...prop} />
          ))}
        </PostContainer>
      </Section>
    </main>
  );
}

let Section = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={`pt-[54px] sm:pt-[62px] md:pt-[71px] lg:pt-[87px] ${className}`}
  >
    {children}
  </section>
);

let projectList: WideTileProps[] = [
  {
    name: 'cse.snu.ac.kr',
    copy: '서울대학교 컴퓨터공학부 홈페이지 리뉴얼에 프론트엔드 개발자로 참여했어요.',
    href: 'https://cse.snu.ac.kr',
    bg: <CserealBg />,
  },
  {
    name: '@yeolyii',
    copy: '인스타그램 개발 계정에 개발 일상을 나눠요. 최근에 팔로워 1만명을 넘었습니다 🎉',
    href: 'https://instagram.com/yeolyii',
    bg: <InstaBg />,
  },
];

let jsList: TileProps[] = [
  {
    name: '파트 1',
    description:
      '기본적인 문법들을 배우며 자바스크립트의 특징이 뭔지 돌아봤어요.',
    concepts: '값, 표현식, 연산자, 구문',
    href: '/js/0',
    code: `console.log('hi');`,
  },
  {
    name: '파트 2',
    description: '객체의 정의 및 특징과 자주 쓰는 객체의 종류들을 배웠어요',
    concepts: '객체, 배열, 함수, 클래스',
    href: '/js/1',
    code: `let obj = {
  toString() {
    return "hi";
  }
}
console.log(obj + '');`,
  },
  {
    name: '파트 3',
    description: '자바스크립트 모듈과 표준 라이브러리를 배웠어요.',
    concepts: '모듈, Set, Map, Intl, URL...',
    href: '/js/2',
    code: `let s = new Set();
s.add('h').add('i');
console.log(...s);`,
  },
  {
    name: '파트 4',
    description: '이터레이터나 프로미스처럼 언어의 자세한 기능들을 배웠어요.',
    concepts: '이터레이터, 제너레이터, 프로미스, async/await',
    href: '/js/3',
    code: `function* foo() {
  yield* ['h', 'i'];
}
console.log(...foo());`,
  },
];

let postList: PostTileProps[] = [
  {
    title: '준비중...',
    dateStr: '2024.06.23',
    href: '/',
    src: '/cserealbg.png',
  },
];
