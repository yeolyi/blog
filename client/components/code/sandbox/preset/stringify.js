const INDENT = '  ';

const T_NEWLINE_OR_SPACE = '@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@';

const T_NEWLINE = '@@__STRINGIFY_OBJECT_NEW_LINE__@@';
const T_PAD = '@@__STRINGIFY_OBJECT_PAD__@@';
const T_PAD_INDENT = '@@__STRINGIFY_OBJECT_INDEND__@@';

// TODO: 반응형
const INLINE_CHARACTER_LIMIT = 60;

class _Stringify {
  seen = [];

  stringify(input, pad = '') {
    // exception
    if (this.seen.includes(input)) return '[Circular]';
    if (input === globalThis) return `[window]`;

    const type = typeof input;

    // string
    if (type === 'string') {
      // single quotes
      input = input.replace(/'/g, "\\'");
      return `'${input}'`;
    }

    // primitive
    if (this.#isNaiveString(input)) return String(input);

    // custom primitive
    if (type === 'function') return `[Function: ${input.name}]`;
    if (type === 'bigint') return `${String(input)}n`;

    // wrapper obj
    let wrapper = this.#getWrapperObj(input);
    if (wrapper) return `[${wrapper.name}: ${input.toString()}]`;

    // date
    if (input instanceof Date) return `[Date: ${input.toLocaleString()}]`;

    // map
    if (input instanceof Map)
      return `Map ${this.stringify(Object.fromEntries(input.entries()), `${pad}    `)}`;

    // set
    if (input instanceof Set)
      return `Set ${this.stringify([...input], `${pad}    `)}`;

    // DOM
    if (input instanceof Node) return `[Node: ${input.nodeName}]`;

    // Error
    if (input instanceof Error) return `[Error: ${input.message}]`;

    // array
    if (Array.isArray(input)) return this.stringifyArray(input, pad);

    // object
    if (this.#isObject(input)) return this.stringifyObj(input, pad);

    // fallback
    return '[stringify failed]';
  }

  stringifyArray(input, pad) {
    if (input.length === 0) return '[]';

    this.seen.push(input);

    let content = '';

    for (let i = 0; i < input.length; i++) {
      // handle sparse array
      let elementStr =
        i in input ? this.stringify(input[i], pad + INDENT) : '<empty>';
      let isLast = input.length - 1 === i;

      content +=
        isLast ?
          `${T_PAD_INDENT}${elementStr}${T_NEWLINE}`
        : `${T_PAD_INDENT}${elementStr},${T_NEWLINE_OR_SPACE}`;
    }

    this.seen.pop();

    return this.#expandWhiteSpace(`[${T_NEWLINE}${content}${T_PAD}]`, pad);
  }

  stringifyObj(input, pad) {
    let objectKeys = this.#getOwnEnumerableKeys(input);
    // Prototype이 null이면 constructor가 없을 수도 있다.
    let name = input.constructor?.name;

    if (objectKeys.length === 0)
      return name && name !== 'Object' ? `${name} {}` : `{}`;

    this.seen.push(input);

    let content = objectKeys
      .map((element, index) => {
        const eol =
          objectKeys.length - 1 === index ?
            T_NEWLINE
          : `,${T_NEWLINE_OR_SPACE}`;

        const escapeKey =
          typeof element === 'symbol' || /^[a-z$_][$\w]*$/i.test(element);

        let key = escapeKey ? String(element) : this.stringify(element);
        let value = this.stringify(input[element], pad + INDENT);

        return `${T_PAD_INDENT}${key}: ${value}${eol}`;
      })
      .join('');

    this.seen.pop();

    return name && name !== 'Object' ?
        this.#expandWhiteSpace(`${name} {${T_NEWLINE}${content}${T_PAD}}`, pad)
      : this.#expandWhiteSpace(`{${T_NEWLINE}${content}${T_PAD}}`, pad);
  }

  #isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
  }

  #getOwnEnumerableKeys(object) {
    return [
      ...Object.keys(object),
      ...Object.getOwnPropertySymbols(object).filter((key) =>
        Object.prototype.propertyIsEnumerable.call(object, key),
      ),
    ];
  }

  #expandWhiteSpace(string, pad) {
    let oneLined = string
      .replace(new RegExp(`${T_NEWLINE_OR_SPACE}`, 'g'), ' ')
      .replace(new RegExp(`${T_NEWLINE}|${T_PAD_INDENT}|${T_PAD}`, 'g'), '');

    if (oneLined.length <= INLINE_CHARACTER_LIMIT) return oneLined;

    return string
      .replace(new RegExp(`${T_NEWLINE}|${T_NEWLINE_OR_SPACE}`, 'g'), '\n')
      .replace(new RegExp(T_PAD, 'g'), pad)
      .replace(new RegExp(T_PAD_INDENT, 'g'), pad + INDENT);
  }

  #isNaiveString(input) {
    return (
      input === null ||
      input === undefined ||
      typeof input === 'number' ||
      typeof input === 'boolean' ||
      typeof input === 'symbol' ||
      this.#isRegexp(input)
    );
  }

  #isRegexp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]';
  }

  #getWrapperObj(input) {
    return [Number, Boolean, BigInt, String].find((x) => input instanceof x);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let notUnusedStringify = (input) => {
  return new _Stringify().stringify(input);
};
