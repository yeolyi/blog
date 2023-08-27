export default function extractFrontMatter(content: string) {
  const reg = /---\s*((?:.|\n)*?)---((?:.|\n)*)/;
  const match = content.match(reg);
  if (match === null) {
    return { data: {}, content };
  } else {
    const data = match[1].split('\n').reduce<{ [key: string]: string }>((acc, cur) => {
      if (!cur.includes(':')) return acc;
      const [key, value] = cur.split(':');
      acc[key.trim()] = value.trim();
      return acc;
    }, {});
    return {
      data,
      content: match[2],
    };
  }
}
