모듈은 여러 사람이 만든 코드들을 합쳐 거대한 프로그램을 만들 수 있도록 돕습니다.
합치는 과정에서 다른 모듈 있는 코드가 내 코드가 영향을 주지 못하도록 제한합니다.

## Modules with Classes, Objects, and Closures

**클로저**를 활용해 필요한 구현만 외부에 제공할 수 있습니다:

```js
let stats = (function () {
  // 외부에 노출되지 않는 함수
  const sum = (x, y) => x + y;

  function mean(data) {
    return data.reduce(sum) / data.length;
  }

  // 외부에 노출되는 함수
  return { mean };
})();

console.log(stats.mean([1, 2, 3, 4, 5]));
```

이와 같은 클로저 기반 모듈화는 **자동화**가 가능합니다. 웹팩 같은 번들러나
노드의 `require`가 이러한 방식을 사용합니다.

## Modules in Node

파일을 네트워크에서 받아오는 브라우저와 달리 노드는 상대적으로 빠른 **파일
시스템**을 사용합니다. 따라서 프로그램을 굳이 하나의 파일로 합칠 필요가
없습니다.

노드에서 각 파일은 독립적인 네임스페이스를 가지는 독립된 모듈입니다. 상수, 변수,
함수 등을 export해야 다른 파일에서 볼 수 있어요.

노드에는 전역 객체인 `module`과 `exports`가 있고 이들을 통해 값들을 내보낼 수
있습니다. 두 객체는 조금씩 다릅니다:

https://stackoverflow.com/a/26451885

`require`로 값을 들여올 수 있습니다.

```js
// @noexec
// 1. "/"가 없는 경우
// 노드의 빌트인 모듈 혹은
let fs = require('fs');
// 패키지 매니저로 설치한 모듈,
let express = require('express');

// 2. "/"가 있는 경우

// 내가 작성한 코드
let stats = require('./stats.js');
```

`import`, `export`가 도입되기 전까지는 브라우저에서도 번들러를 통해 `require`
문법을 많이 사용했습니다.

## Modules in ES6

ESM 이전 스크립트에서는 top-level 선언들이 모든 스크립트간에 공유되지만,
ESM에서는 **파일 단위**로 한정됩니다. ES6 모듈을 사용하면 자동으로 'use
strict'가 되며 top-level에서의 `this`가 `undefined`가 됩니다:

```html
<!-- ✍️: type="module"을 지워보세요 -->
<script type="module">
  console.log(this);
  let a = 123;
</script>
<script type="module">
  console.log(a);
</script>
```

일반 `export`는 식별자가 있는 값에만 사용할 수 있지만 `export default`는 없어도
됩니다. `import`할 때 전자는 `export`한 이름으로 가져와야하지만 후자는 임의의
이름을 사용할 수 있습니다.

두 export 방법에 대한 논의:

https://github.com/airbnb/javascript/issues/1365

ESM은 CJS와 다르게 top-level에서만 `import/export`가 가능하기에 정적
분석(tree-shaking 등)이 용이합니다. 또한 CJS는 로드한 모듈의 **값**을 사용해
`export`쪽의 수정사항이 `import`쪽에 반영되지 않지만 ESM은 **메모리 주소**를
사용하기에 반영됩니다.

```js
// @noexec
// 여러 객체 한 번에 export하기
export { Circle, degreesToRadians, PI };

// 모든 non-default export 가져오기
import * as stats from './stats.js';

// export 없는 모듈 사용하기
// 의미없어보이지만 이벤트 핸들러를 등록하는 등 유용한 작업을 할 수도 있어요
import './analytics.js';

// import하면서 이름 바꾸기
import { default as Histogram, mean, stddev } from './histogram-stats.js';
```

여러 모듈에 있는 export들을 모아 하나의 파일에서 제공하고 싶다면 re-exports를
활용합니다:

```js
// @noexec
export { mean } from './stats/mean.js';
export { stddev } from './stats/stddev.js';

// 모든 named value들을 export합니다
export * from './stats/mean.js';
export * from './stats/stddev.js';
```

API의 중앙집중화, 코드 정리 등등을 위해 re-exports를 쓴다는데 성능에 좋지 않다는
글도 있네요:

https://x.com/iamakulov/status/1331551351214645251

이제 대부분의 브라우저가 ESM을 지원해 번들러 없이도 개발이 가능하긴 하지만
장단점이 있습니다. 모듈을 활용해 스크립트들을 쪼개면 캐싱이 용이하지만 각
스크립트의 의존성을 해소하는 과정에서 waterfall이 일어날 수 있어요.

CJS와 ESM을 구분하기 위해 .mjs, .cjs 확장자를 쓰기도 해요:

https://stackoverflow.com/questions/57492546/what-is-the-difference-between-js-and-mjs-files

모바일 환경에서 필요한 모든 모듈을 한 번에 불러오는 것은 비효율적이므로
**dynamic import**를 통해 번들을 쪼개 필요할 때 불러올 수 있습니다. 옛날에는
HTML에 스크립트 태그를 추가하는 방식으로 했었다네요.

```js
// @noexec
async function analyzeData(data) {
  let stats = await import('./stats.js');
  return {
    average: stats.mean(data),
    stddev: stats.stddev(data),
  };
}
```

`import.meta`는 현재 실행중인 모듈의 메타데이터를 포함합니다. 그중에서도 url
값을 아래와 같이 활용할 수 있어요. 같은 디렉터리에 있는 다른 파일의 경로를
받아옵니다.

```js
// @noexec
function localStringsURL(locale) {
  return new URL(`l10n/${locale}.json`, import.meta.url);
}
```

## 읽어볼만한 글들

https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/

https://stackoverflow.com/questions/35551366/what-is-the-defined-execution-order-of-es6-imports

https://toss.tech/article/commonjs-esm-exports-field

https://yceffort.kr/2023/05/what-is-commonjs
