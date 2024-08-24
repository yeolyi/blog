# Selectors

HTML 어딘가에 존재하는 요소를 찾아 스타일을 적용하는 방법을 배워봅시다.

## Basic Style Rules

CSS의 중심 기능은 특정 규칙들을 문서의 모든 특정 요소들에 적용하는 것입니다:

```html
<style>
  h2 {
    /* ✍️ 색을 바꿔보세요 */
    color: gray;
  }
</style>
<h2>Heading 1</h2>
<h2>Heading 2</h2>
```

## Class and ID Selectors

```html
<style>
  /* ✍️ wildcard를 p로 수정해보세요 */
  /* *.warning과 .warning은 같습니다 */
  *.warning {
    font-weight: bold;
  }
</style>
<p class="warning">paragraph with warning</p>
<p>paragraph <span class="warning">span with warning</span> paragraph</p>
```

<br />

```html
<style>
  .warning {
    font-weight: bold;
  }
  .urgent {
    font-style: italic;
  }
  .warning.urgent {
    background: silver;
  }
</style>
<p class="urgent warning">urgent warning</p>
<p>paragraph <span class="warning">warning</span> paragraph</p>
```

## Attribute Selectors

요소의 속성 유무를 selector로 사용할 수 있습니다:

```html
<style>
  p[foo] {
    color: red;
  }
  p[foo][bar] {
    color: orange;
  }
</style>
<p>text</p>
<p foo>text</p>
<p foo bar>text</p>
```

alt가 있는 이미지를 하이라이트 하는 등의 활용 방법이 있습니다:

```css
img[alt] {
  outline: 3px solid red;
}
```

속성의 값을 사용할 수도 있습니다. 이전의 클래스 selector와 달리 정확히 같아야
적용돼요:

```html
<style>
  p[foo='foo'] {
    color: orange;
  }
</style>
<!-- ✍️ "foo bar"로 바꿔보세요 -->
<p foo="foo">text</p>
```

속성 값의 일부를 사용할 수도 있습니다.

| 유형            | 설명                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `[foo~="bar"]`  | 공백으로 구분된 단어 목록에 "bar" 단어가 포함된 `foo` 속성을 가진 모든 요소를 선택합니다.                          |
| `[foo*="bar"]`  | `foo` 속성 값에 "bar" 서브스트링이 포함된 모든 요소를 선택합니다.                                                  |
| `[foo^="bar"]`  | `foo` 속성 값이 "bar"로 시작하는 모든 요소를 선택합니다.                                                           |
| `[foo$="bar"]`  | `foo` 속성 값이 "bar"로 끝나는 모든 요소를 선택합니다.                                                             |
| `[foo\|="bar"]` | `foo` 속성 값이 "bar"로 시작하고 그 뒤에 하이픈(-)이 오거나 `foo` 속성 값이 정확히 "bar"인 모든 요소를 선택합니다. |

`*=`와 `|=`는 라이브러리에서 다음과 같이 활용될 수 있어요:

```html
<style>
  *[class|='btn'][class*='-arrow']:after {
    content: '▼';
  }
</style>
<button class="btn-small-arrow-active">Click Me</button>
```

`^=`와 `$=`의 활용 예시입니다:

```html
<style>
  a[href^='https:'] {
    color: red;
  }
  a[href^='mailto:'] {
    color: orange;
  }
  a[href$='.pdf'] {
    color: green;
  }
</style>

<a href="https://yeolyi.com">blog</a>
<a href="mailto:yeolyi1310@gmail.com">mail</a>
<a href="/sample.pdf">pdf</a>
```

i를 붙이면 대소문자 구분없이 attribute selector를 사용할 수 있어요:

```html
<style>
  /* ✍️ i를 빼보세요 */
  a[href$='.pdf' i] {
    color: red;
  }
</style>
<a href="/sample.pdf">pdf</a>
<a href="/sample.PDF">PDF</a>
<a href="/sample.zip">zip</a>
```

## Using Document Structure

CSS의 강력함은 대부분 HTML 요소의 부모-자식 관계를 활용하는데서 옵니다.

Descendant selector 구조적 상황에 따라 규칙을 적용할 수 있습니다. Selector를
오른쪽에서 왼쪽으로 읽는게 자연스럽습니다:

```html
<style>
  /* 임의의 em중에 조상 요소에 p가 있는것 */
  p em {
    color: gray;
  }
</style>
<em>em</em>
<p>... <em>em in paragraph</em></p>
```

Descendant selector는 요소간의 거리에 상관없이 적용됩니다. 우선순위에도 거리가
영향을 주지 않습니다:

```html
<style>
  /* 두 스타일의 우선순위는 동일합니다. */
  /* 단지 red가 나중에 선언됐기에 이 스타일이 적용됩니다. */
  /* help보다 aside가 span에 가까운 것은 중요하지 않습니다 */
  /* ✍️ 두 스타일의 위치를 바꿔보세요 */
  div:not(.help) span {
    color: gray;
  }
  div.help span {
    color: red;
  }
</style>

<div class="help">
  <div class="aside">
    This text contains <span>a span element</span> within.
  </div>
</div>
```

Adjacent-sibling combinator(+)로 형제 요소에 따라 스타일을 적용할 수 있습니다.
사이에 텍스트 노드가 있어도 동작합니다:

```html
<style>
  li + li {
    font-weight: bold;
  }
</style>
<ol>
  <li>first</li>
  <!-- 텍스트 노드는 ol의 자식 노드가 아닙니다 -->
  text
  <li>second</li>
  text
  <li>third</li>
</ol>
```

General-sibling combinator(~)는 인접하지 않아도 됩니다.
