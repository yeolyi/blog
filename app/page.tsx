import Image from 'next/image';
import { Gallery } from '../components/gallery/Gallery';
import profile from '@/public/profile.jpg';
import { ReactNode } from 'react';
import {
  WideTile,
  Tile,
  TileProps,
  WideTileProps,
  TileContainer,
  TileTitle,
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
import jsbook from '@/public/jsbook.png';

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
    name: '값',
    description: '다양한 타입의 값들과 그 특징을 공부했습니다.',
    concepts: '타입, 값, 변수, 형변환',
    href: '/js/value',
    code: `let n = 123.4567;
console.log(n.toFixed(5));`,
  },
  {
    name: '표현식과 연산자',
    description: '값들을 연산자로 조합해 다른 값을 만드는 과정을 공부했습니다.',
    concepts: '산술, 비교, 논리, 할당 연산자',
    href: '/js/expression',
    code: `console.log(2 + 2);
console.log('2' + '2');
console.log(2 + 2 - 1);
console.log('2' + '2' - '2');`,
  },
  {
    name: '구문',
    description: '실행 상태에 변화를 일으키는 구문들을 공부했습니다.',
    concepts: 'if, for, while, 선언문',
    href: '/js/statement',
    code: `for (let i = 0; i < 5; i++) {
    console.log('x'.repeat(i));
}`,
  },
  {
    name: '객체',
    description: '자바스크립트의 가장 중요한 주제인 객체를 공부했습니다.',
    concepts: '프로퍼티, 프로토타입, 직렬화',
    href: '/js/object',
    code: `let obj2 = Object.create(null);
console.log(String(obj2));`,
  },
  {
    name: '배열',
    description:
      '다른 언어들과 미묘하게 다른 자바스크립트의 배열을 공부했습니다.',
    concepts: '희소 배열, 배열의 순회, 유사 배열',
    href: '/js/array',
    code: `let a = [1, 2, 3];
delete a[2];
console.log(2 in a);
console.log(a[2]);
console.log(a.length);`,
  },
  {
    name: '함수',
    description: '여러 맥락에서 조금씩 다르게 사용되는 함수를 공부했습니다.',
    concepts: '클로저, this, 생성자',
    href: '/js/function',
    code: `function f() {
  console.log(this);
}

f();
f.call({ x: 123 }, 1, 2);`,
  },
  {
    name: '클래스',
    description:
      '프로토타입에서 클래스 문법까지 클래스를 정의하는 방법들을 공부했습니다.',
    concepts: '프로토타입, 생성자, 클래스',
    href: '/js/class',
    code: `class A {
  static foo() {
    console.log('foo');
  }
}

console.log('foo' in A.prototype)`,
  },
  {
    name: '모듈',
    description: '자바스크립트에서 모듈을 사용하는 여러 방법을 공부했습니다.',
    concepts: 'CJS, ESM',
    href: '/js/module',
    code: ``,
  },
  {
    name: '라이브러리',
    description:
      '자바스크립트 표준 라이브러리에 어떤 것들이 있는지 공부했습니다.',
    concepts: 'Set, Map, ArrayBuffer, Date, Intl...',
    href: '/js/library',
    code: `let a = new Uint8Array(1);
a[0] = -1;
console.log(a[0]);`,
  },
  {
    name: '이터레이터',
    description: '-',
    concepts: '-',
    href: '/js/iterator',
    code: `function* foo() {
  yield* [1, 2];
}
function* bar() {
  yield* foo();
}
console.log(...bar());`,
  },
  {
    name: '비동기 프로그래밍',
    description: '-',
    concepts: '-',
    href: '/js/async',
    code: `Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2))
  .then(() => console.log(3));`,
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
