'use client';

import { TileProps, WideTileProps } from './Gallery';
import { CserealBg } from './CserealBg';
import { useEffect } from 'react';
import gsap from 'gsap';

const InstaBg = () => {
  useEffect(() => {
    let heartList = [...document.querySelectorAll('.heart')];
    heartList.forEach((heart) => {
      gsap.to(heart, {
        y: -600,
        repeat: -1,
        duration: 'random(3,5)',
        opacity: 0,
        filter: 'blur(4px)',
        ease: 'sine.out',
      });
    });
  }, []);

  return (
    <div className="instabg">
      <ul className="hearts flying">
        {[...Array(30).keys()].map((i) => (
          <li
            suppressHydrationWarning
            className="heart"
            key={i}
            style={{ left: Math.random() * 100 + '%' }}
          />
        ))}
      </ul>
    </div>
  );
};

export const projectProps: WideTileProps[] = [
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

export const jsProps: TileProps[] = [
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
