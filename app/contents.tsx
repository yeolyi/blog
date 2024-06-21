import { TileProps, WideTileProps } from './Gallery';

export const jsProps: TileProps[] = [
  {
    name: '파트 1',
    description: '표현식과 구문같은 언어의 기본적인 내용을 배웠어요.',
    concepts: '표현식, 구문',
    href: '/js/0',
    code: 'console.log("Hello!")',
  },
  {
    name: '파트 2',
    description:
      '객체란 무엇인지, 그리고 배열과 함수같이 자주 쓰는 객체들에 대해 배웠어요',
    concepts: '표현식, 구문',
    href: '/js/1',
    code: `let obj = {
  toString() {
    return "🙌";
  }
}
console.log(obj + '');`,
  },
  {
    name: '파트 3',
    description: '자바스크립트 모듈과 표준 라이브러리를 배웠어요.',
    concepts: '표현식, 구문',
    href: '/js/2',
    code: `let s = new Set();
s.add('h').add('i');
console.log(...s);`,
  },
  {
    name: '파트 4',
    description: '이터레이터나 프로미스처럼 언어의 자세한 기능들을 배웠어요.',
    concepts: '표현식, 구문',
    href: '/js/3',
    code: `function* foo() {
  yield* ['h', 'i'];
}
console.log(...foo());`,
  },
];

export const projectProps: WideTileProps[] = [
  {
    name: 'cse.snu.ac.kr',
    copy: '서울대학교 컴퓨터공학부 홈페이지 리뉴얼에 프론트엔드 개발자로 참여했어요.\n관리자 로그인, 예약 페이지, I18n등을 작업했어요.',
    href: 'https://cse.snu.ac.kr',
    bg: <div className="h-full w-full bg-gray-800" />,
  },
  {
    name: '@yeolyii',
    copy: '인스타그램 개발 계정에 개발 일상을 나눠요. 최근에 팔로워 1만명을 넘었습니다 🎉',
    href: 'https://cse.snu.ac.kr',
    bg: <div className="h-full w-full bg-gray-800" />,
  },
];
