// @ts-expect-error TODO
import * as _Babel from '@babel/standalone';

// https://dev.to/jser_zanp/how-to-detect-infinite-loop-in-javascript-28ih
const parseCode = (code: string) => {
  const Babel: any = _Babel;
  const parser = Babel.packages.parser;
  const traverse = Babel.packages.traverse.default;
  const generate = Babel.packages.generator.default;

  const ast = parser.parse(code);
  const prefix = `
var __count = 0
var __detectInfiniteLoop = () => {
  if (__count > 1000) {
    throw new Error('Infinite Loop detected.')
  }
  __count += 1
}
`;
  const detector = parser.parse(`__detectInfiniteLoop()`);
  const f = (path: any) => {
    path.node.body.body.push(...detector.program.body);
  };

  traverse(ast, { ForStatement: f, WhileStatement: f, DoWhileStatement: f });

  return prefix + generate(ast).code;
};

export default parseCode;
