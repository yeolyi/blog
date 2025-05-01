import chapter1 from '@/app/[locale]/assets/chapter1.png';
import type { StaticImageData } from 'next/image';

export type PostType = {
  id: number;
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
        id: 1,
        title: '컴퓨터의 첫 언어: 0과 1, 그리고 스위치의 마법',
        isPublished: false,
      },
      {
        id: 2,
        title: '논리 게이트 첫걸음: AND, OR, NOT으로 생각하는 법 배우기',
        isPublished: false,
      },
      {
        id: 3,
        title: '만능 재료 NAND 게이트: 이것 하나로 모든 논리를 만든다고?',
        isPublished: false,
      },
      {
        id: 4,
        title: '1 + 1 = 10? 컴퓨터 덧셈의 비밀, 가산기 만들기',
        isPublished: false,
      },
      {
        id: 5,
        title: '컴퓨터의 기억력: 플립플롭과 메모리는 어떻게 정보를 저장할까?',
        isPublished: false,
      },
      {
        id: 6,
        title: '컴퓨터의 두뇌 CPU 파헤치기: 폰 노이만 구조와 명령어 사이클',
        isPublished: false,
      },
      {
        id: 7,
        title: '데이터 고속도로 개통! 버스와 메모리 계층의 비밀',
        isPublished: false,
      },
    ],
  },
  {
    id: 'data-structures',
    title: '파트 2: 자료구조와 알고리즘',
    posts: [
      {
        id: 8,
        title: '내 코드는 왜 느릴까? Big O로 알고리즘 성능 측정하기',
        isPublished: false,
      },
      {
        id: 9,
        title: '데이터 정리의 기본: 배열 vs 연결 리스트, 언제 뭘 써야 할까?',
        isPublished: false,
      },
      {
        id: 10,
        title: '마지막 접시가 먼저? 줄 선 순서대로! 스택과 큐 파헤치기',
        isPublished: false,
      },
      {
        id: 11,
        title: '관계와 계층 표현의 달인: 트리와 그래프 기초 다지기',
        isPublished: false,
      },
      {
        id: 12,
        title: '미로 탐험처럼! 트리와 그래프를 누비는 DFS & BFS',
        isPublished: false,
      },
      {
        id: 13,
        title: '정렬 알고리즘 동물원: 버블, 선택, 삽입부터 퀵 정렬까지!',
        isPublished: false,
      },
      {
        id: 14,
        title: '그래서 어떤 정렬/탐색이 제일 좋나요? 성능 비교 분석',
        isPublished: false,
      },
      {
        id: 15,
        title: 'O(1) 검색의 마법! 해시 테이블은 어떻게 작동할까?',
        isPublished: false,
      },
    ],
  },
  {
    id: 'os-network',
    title: '파트 3: 운영체제와 네트워크',
    posts: [
      {
        id: 16,
        title: '운영체제(OS)는 왜 필요할까? 시스템 프로그래밍 첫걸음',
        isPublished: false,
      },
      {
        id: 17,
        title: '멀티태스킹의 비밀: 프로세스와 스레드는 뭐가 다를까?',
        isPublished: false,
      },
      {
        id: 18,
        title: '내 컴퓨터 RAM은 왜 항상 부족할까? 가상 메모리의 마법',
        isPublished: false,
      },
      {
        id: 19,
        title: '인터넷 서핑의 뒷단: TCP/IP와 HTTP는 어떻게 통신할까?',
        isPublished: false,
      },
      {
        id: 20,
        title: '드디어 완성! 하드웨어부터 앱까지, 모든 조각 맞추기',
        isPublished: false,
      },
    ],
  },
  {
    id: 'appendix',
    title: '부록',
    posts: [
      {
        id: 21,
        title: '게임 속 컴퓨터? 마인크래프트 레드스톤으로 논리 회로 만들기!',
        isPublished: false,
      },
    ],
  },
];
