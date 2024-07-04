import Code from '@/components/code/Code';
import Sandbox from '@/components/code/sandbox/Sandbox';
import { TileProps } from '@/components/gallery/Tile';

export let jsTileProps: TileProps[] = [
  {
    name: '값',
    description:
      '자바스크립트에 있는 값들의 종류와 형변환 과정을 공부했습니다.',
    concepts: '타입, 값, 변수, 형변환',
    href: '/js/value',
    content: `let n = 123.4567;
console.log(n.toFixed(5));`,
  },
  {
    name: '연산자',
    description:
      '값들을 연산자로 조합해 새로운 값을 만드는 방법을 공부했습니다.',
    concepts: '산술, 비교, 논리, 할당 연산자',
    href: '/js/expression',
    content: `console.log(2 + 2);
console.log('2' + '2');
console.log(2 + 2 - 1);
console.log('2' + '2' - '2');`,
  },
  {
    name: '구문',
    description: '여러 구문을 모아 프로그램을 만드는 방법을 공부했습니다.',
    concepts: 'if, for, while, 선언문',
    href: '/js/statement',
    content: `for (let i = 1; i < 5; i++) {
    console.log('x'.repeat(i));
}`,
  },
  {
    name: '객체',
    description: '자바스크립트의 가장 중요한 주제인 객체를 공부했습니다.',
    concepts: '프로퍼티, 프로토타입, 직렬화',
    href: '/js/object',
    content: `let obj2 = Object.create(null);
console.log(String(obj2));`,
  },
  {
    name: '배열',
    description:
      '다른 언어들과 미묘하게 다른 자바스크립트의 배열을 공부했습니다.',
    concepts: '희소 배열, 배열의 순회, 유사 배열',
    href: '/js/array',
    content: `let a = [1, 2, 3];
delete a[2];
console.log(2 in a);
console.log(a[2]);
console.log(a.length);`,
  },
  {
    name: '함수',
    description:
      '맥락에 따라 다르게 동작하는 자바스크립트의 함수와 this 키워드를 공부했습니다.',
    concepts: '클로저, this, 생성자',
    href: '/js/function',
    content: `function f() {
  console.log(this);
}

f();
f.call({ x: 123 }, 1, 2);`,
  },
  {
    name: '클래스',
    description:
      '클래스의 성질이 자바스크립트에서 어떻게 구현되는지 공부했습니다.',
    concepts: '프로토타입, 생성자, 클래스',
    href: '/js/class',
    content: `class A {
  static foo() {
    console.log('foo');
  }
}

console.log('foo' in A.prototype)`,
  },
  {
    name: '모듈',
    description:
      '모듈이 왜 필요한지, 자바스크립트에 어떤 종류의 모듈 시스템이 있는지 공부했습니다.',
    concepts: 'CJS, ESM',
    href: '/js/module',
  },
  {
    name: '라이브러리',
    description:
      '자바스크립트 표준 라이브러리에 어떤 것들이 있는지 공부했습니다.',
    concepts: 'Set, Map, ArrayBuffer, Date, Intl...',
    href: '/js/library',
    content: `let a = new Uint8Array(1);
a[0] = -1;
console.log(a[0]);`,
  },
  {
    name: '이터레이터',
    description:
      '데이터에 순서대로 접근하는 과정을 어떻게 추상화했는지 공부했습니다.',
    concepts: 'iterator, iterable, generator, yield',
    href: '/js/iterator',
    content: `function* foo() {
  yield* [1, 2];
}
function* bar() {
  yield* foo();
}
console.log(...bar());`,
  },
  {
    name: '비동기 프로그래밍',
    description:
      '자바스크립트가 비동기 작업을 어떻게 표현하며 어떻게 처리하도록하는지 공부했습니다.',
    concepts: 'callback, promise, async/await',
    href: '/js/async',
    content: `Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2))
  .then(() => console.log(3));`,
  },
  {
    name: '메타 프로그래밍',
    description:
      '코드를 수정하는 코드인 메타 프로그래밍에 관련된 API들을 공부했습니다.',
    concepts: 'Property Attributes, Template Tags, Reflect, Proxy',
    href: '/js/meta',
    content: `let obj = { x: 1 };
Object.freeze(obj);
console.log(Object.isFrozen(obj));`,
  },
].map((x) => ({
  ...x,
  children: x.content ? (
    <Sandbox presetName="js" code={x.content} norefresh />
  ) : undefined,
  style: {
    backgroundImage: `linear-gradient(
        163deg,
    hsl(51deg 97% 59%) 1%,
    hsl(50deg 93% 58%) 51%,
    hsl(49deg 90% 56%) 49%,
    hsl(48deg 86% 54%) 99%
  )`,
  },
}));
