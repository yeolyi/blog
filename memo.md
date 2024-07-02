https://stackoverflow.com/questions/43709005/let-const-and-var-on-global-functions-in-javascript

객체의 프로퍼티들을 순회/열거하는 방법들:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties

> 주의: Object.prototype.**proto**는 오늘날 대부분의 브라우저에서 지원되지만, 그
> 존재와 정확한 동작은 오직 웹 브라우저와의 호환성을 보장하기 위한 레거시
> 기능으로서 ECMAScript 2015 사양에서 비로소 표준화되었습니다. 더 나은 지원을
> 위해 대신 Object.getPrototypeOf()를 사용하세요.
>
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/proto

## 자바스크립트 개요

코어 js에는 입출력 기능이 포함되어있지 않습니다. 입출력, 네트워크, 그래픽 등의
기능은 js가 임베딩된 호스트 환경의 책임입니다.

함수와 클래스가 단순히 언어 구문(syntax)이 아니라 코드에 의해 조작될 수 있는
값이라는 점에서 다른 정적 언어들과 다릅니다.

### Identifiers and Reserved Words

쓸 일은 없지만, let도 변수명으로 경우에 따라 쓸 수는 있습니다.

```js
// ✍️ 아래 주석을 해제해보세요
// 'use strict'
var let = 'hello, world!';
console.log(let);
```

### Unicode

```js
// ✍️ 유니코드 값을 바꿔보세요
const π = 3.14;
console.log(π, '\u{1F600}');
```

<br />

```js
const str = [...Array(9).keys()]
  .map((x) => 0x1f311 + x)
  .map((x) => String.fromCodePoint(x))
  .join(' ');

console.log(str);
```

문자의 모양이 같더라도 다른 유니코드 값일 수 있습니다. 유니코드 표준에
normalization 알고리즘이 있지만 JS가 이를 처리해주지는 않으므로 에디터에서 잘
해주는지 확인합시다.

### Optional Semicolons

세미콜론이 없으면 동작이 직관과 다른 경우가 있습니다.

```js
// prettier-ignore
let y = 1 + 2
(3 + 4).toString()
```

부동소수점이 근사값을 사용하는게 문제라면 scaled integer를 사용해볼 수 있습니다.
이더리움에서는 wei라는 최소 단위(=10^(-18)ether)를 쓰는데 책에서 말하는 scaled
integer과 비슷한 것 같습니다.

strict mode의 유무에 따라 선언되지 않는 변수에 대한 처리가 달라집니다. strict
mode가 아니면 새로운 전역 변수가 생성됩니다. 이러한 변수는 var로 선언된 변수와
특성이 '유사'합니다.

```js
(() => {
  a = 10;
})();

console.log(a);

(() => {
  'use strict';
  b = 10;
})();
```

## Object Creation Expressions

(굳이 싶지만 ㅎ,,) 생성자에 전달되는 인자가 없으면 아래와 같은 문법도
가능합니다:

```js
// prettier-ignore
console.log(new Date);
```

변수, 객체 프로퍼티, 배열의 요소는 모두 lvalue입니다.

Side effect가 있는 연산자들:

- Assigment operator
- increment, decrement operator
- delete operator
- some function/object creation

break, continue의 기능을 포함한다면 while문으로 for문을 완벽하게 재현하는 것은
불가능합니다.

책에서는 strict mode에서 duplicated property name이 안된다고 했는데 ES2015부터
다시 허용하나봅니다:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Duplicate_property_names

신기하게도 프로퍼티 이름으로 빈 문자열도 가능합니다:

```js
let a = { '': 1 };
console.log(a['']);
```

일반 객체가 연관 배열(딕셔너리)로 자주 활용되기는 하지만 Map 클래스가 더 나은
경우가 있습니다.

https://web.mit.edu/jwalden/www/isArray.html

정확한 생성자가 궁금하다면 `constructor` 프로퍼티를 활용할 수 있어요:

```js
function A() {}
function B() {}
A.prototype = B.prototype = {};

// 프로토타입 객체를 수동으로 만들었다면 `constructor` 프로퍼티를 잘 설정해줘야합니다
A.prototype.constructor = A;
B.prototype.constructor = A;

let a = new A();
console.log(
  Object.getPrototypeOf(a).constructor === A,
  Object.getPrototypeOf(a).constructor === B,
);
```

```js
function A() {}

// 방법 1
A.prototype = {
  constructor: A,
  foo() {
    console.log('foo');
  },
};

function B() {}

// 방법 2
B.prototype.foo = function () {
  console.log('foo');
};

console.log(new A().constructor === A, new B().constructor === B);
```

여담으로 클래스 표현식을 사용해 아래와 같은 표기도 가능하긴 가능합니다:

```js
class Span extends class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
  includes(x) {
    return this.from <= x && x < this.to;
  }
} {
  constructor(start, span) {
    super(start, start + span);
  }
}

console.log(new Span(5, 5).includes(8));
```
