export let stringifySrc = `
function stringify(x) {
  // primitive + function
  switch (typeof x) {
    case 'number':
    case 'boolean':
      return x.toString();
    case 'bigint':
      return x.toString() + 'n';
    case 'string':
      // 두 번 stringify해 escape되는 것 방지
      return \`'\${x}'\`;
    case 'undefined':
      return 'undefined';
    case 'symbol':
      return \`Symbol(\${x.description})\`;
    case 'function':
      return \`[Function: \${x.name}]\`;
  }

  // null
  if (x === null) return 'null';

  // 전역 객체 stringify시 에러 우회
  if (x === globalThis) return 'Window {...}';

  // 래퍼 객체
  for (let wrapper of [Number, Boolean, BigInt, String])
    if (x instanceof wrapper) return \`[\${wrapper.name}: \${x.toString()}]\`;

  // 배열
  // 희소 배열 처리는 map 덕분에 자연스럽게 된다.
  // 즉 stringify가 호출되지 않지만 join에 empty item이 반영된다.
  if (x instanceof Array)
    return \`[\${x.map((x) => stringify(x)).join(', ')}]\`;

  // Date
  if (x instanceof Date) return x.toLocaleString();

  // 일반 객체
  let name = x.constructor.name;

  let content = '{ ';
  for (let [key, value] of Object.entries(x)) {
    content += \`\${stringify(key)}: \${stringify(value, true)}, \`;
  }
  content = content.length === 2 ? '{}' : content.slice(0, -2) + ' }';

  if (name === 'Object') {
    return content;
  } else {
    return \`\${name} \${content}\`;
  }
}`;
