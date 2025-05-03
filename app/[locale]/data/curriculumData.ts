import chapter1 from '@/app/[locale]/assets/chapter1.png';
import chapter2 from '@/app/[locale]/assets/chapter2.png';
import chapter3 from '@/app/[locale]/assets/chapter3.png';
import type { StaticImageData } from 'next/image';

export type PostType = {
  title: string;
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
  title: string;
  image?: StaticImageData;
  posts: PostType[];
};

export const curriculumData: PartType[] = [
  {
    id: 'hardware',
    title: '파트 1: 컴퓨터 하드웨어의 기초',
    image: chapter1,
    posts: [
      {
        title: '0과 1만 쓰는 컴퓨터가 세상을 표현하는 방법',
        description: '비트, 이진수, 진리표',
        isPublished: false,
      },
      {
        title: '컴퓨터는 엄마가 좋은지 아빠가 좋은지로 구성됨',
        description: '기본 논리 게이트 (AND, OR, NOT)',
        isPublished: false,
      },
      {
        title: '사실 엄마 아빠가 둘 다 좋지는 않았던 컴퓨터',
        description: 'NAND의 보편성(Universality)',
        isPublished: false,
      },
      {
        title: '이제 여러분들은 계산기를 만들 수 있어요 (진짜로)',
        description: '반가산기, 전가산기',
        isPublished: false,
      },
      {
        title: '기억상실증 걸린 컴퓨터를 고쳐줍시다',
        description: '래치, 플립플롭, RAM, ROM',
        isPublished: false,
      },
      {
        title: '계산만 할 줄 알면 계산기지 그게 컴퓨터니?',
        description: '폰 노이만 구조',
        isPublished: false,
      },
      {
        title: 'CPU가 일초에 몇억 번 넘게 반복하는 일',
        description: '명령어 사이클 (Fetch-Decode-Execute)',
        isPublished: false,
      },
      {
        title: '아니 엄마 이건 방정리를 안한게 아니라 캐시라니까?',
        description: '메모리 계층 구조',
        isPublished: false,
      },
    ],
  },
  {
    id: 'data-structures',
    title: '파트 2: 자료구조와 알고리즘',
    image: chapter2,
    posts: [
      {
        title: '저희 방 정리는 안하니 데이터 정리라도 잘해봐요',
        description: '배열과 연결 리스트',
        isPublished: false,
      },
      {
        title: '놀이기구 줄을 스택으로 서면 사람들이 싫어하겠지?',
        description: '스택과 큐',
        isPublished: false,
      },
      {
        title: '신분 상승이 불가능한 알고리즘 세계',
        description: '시간 복잡도',
        isPublished: false,
      },
      {
        title: '정렬 알고리즘 계급도',
        description: '버블, 선택, 삽입, 머지, 퀵, 힙',
        isPublished: false,
      },
      {
        title:
          '개발자들은 나무가 어떻게 생겼는지도 몰라 바깥 구경도 좀 하고 그래',
        description: '트리',
        isPublished: false,
      },
      {
        title: '하나만 파는 애 vs 정신이 좀 산만한 애',
        description: 'DFS, BFS',
        isPublished: false,
      },
      {
        title: '될 때까지 해보고 성과도 내는 자료구조',
        description: '해시 테이블',
        isPublished: false,
      },
    ],
  },
  {
    id: 'os-network',
    title: '파트 3: 운영체제와 네트워크',
    image: chapter3,
    posts: [
      {
        title: 'CPU 쉬는 꼴을 못보는 악랄한 개발자들이 만든 것',
        description: '운영체제의 등장 배경',
        isPublished: false,
      },
      {
        title: '내가 내 컴퓨터의 모든 기능을 쓸 수 없는 이유',
        description: '시스템 콜',
        isPublished: false,
      },
      {
        title: '컴퓨터가 사실 C언어를 알아듣지 못하는 이유',
        description: '컴파일러',
        isPublished: false,
      },
      {
        title: '일잘러 컴퓨터의 할 일 관리법을 배워보자',
        description: '프로세스와 스레드',
        isPublished: false,
      },
      {
        title: "'게임 설치 용량이 50기가인데 램도 50기가 사야하나요?'",
        description: '가상 메모리',
        isPublished: false,
      },
      {
        title: '여러분들이 이 블로그 글을 읽을 수 있는 이유',
        description: '네트워크',
        isPublished: false,
      },
    ],
  },
  {
    id: 'appendix',
    title: '부록',
    posts: [
      {
        title: '마인크래프트 레드스톤으로 컴퓨터 만들기',
        isPublished: false,
      },
    ],
  },
];
