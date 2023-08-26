export interface TOC {
  h2: {
    name: string;
    h3: string[];
  }[];
}

export default function extractTOC(content: string): TOC {
  const h2Reg = /^## (.+)/gm;
  let m: RegExpExecArray | null;
  const h2 = [];
  do {
    m = h2Reg.exec(content);
    if (m) h2.push(m[1]);
  } while (m);

  return {
    h2: h2.map((x) => ({ name: x, h3: [] })),
  };
}
