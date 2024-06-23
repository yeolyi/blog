https://stackoverflow.com/questions/43709005/let-const-and-var-on-global-functions-in-javascript

객체의 프로퍼티들을 순회/열거하는 방법들:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties

> 주의: Object.prototype.**proto**는 오늘날 대부분의 브라우저에서 지원되지만, 그
> 존재와 정확한 동작은 오직 웹 브라우저와의 호환성을 보장하기 위한 레거시
> 기능으로서 ECMAScript 2015 사양에서 비로소 표준화되었습니다. 더 나은 지원을
> 위해 대신 Object.getPrototypeOf()를 사용하세요.
>
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
