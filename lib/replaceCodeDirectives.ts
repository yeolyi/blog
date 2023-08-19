import { readFile } from "fs/promises";
import * as path from "path";

const replaceCodeDirectives = async (
  content: string,
  postAbsolutePath: string
) => {
  const codeContentRegex = /!@([^@!]+)@!/g;
  const replacer = buildReplacer(postAbsolutePath);
  try {
    return await replaceAsync(content, codeContentRegex, replacer);
  } catch (e) {
    console.error(e);
    return content + `\n\n포스트 파싱중에 에러 발생 - ${e}`;
  }
};

const buildReplacer =
  (postAbsolutePath: string) =>
  async (match: string, codeFileRelativePath: string) => {
    const codeFullPath = path.join(postAbsolutePath, codeFileRelativePath);
    const code = await readFile(
      path.join(process.env.SRC_PATH ?? "", codeFullPath),
      {
        encoding: "utf-8",
      }
    );
    const fileExtension = extractFileExtension(codeFileRelativePath);
    return formatMarkdownCode(fileExtension, code);
  };

const extractFileExtension = (filePath: string) => {
  const splited = filePath.split(".");

  if (splited.length < 2)
    throw new Error(`${filePath}에서 확장자를 찾을 수 없음.`);

  return splited[splited.length - 1];
};

const formatMarkdownCode = (fileExtension: string, code: string) =>
  `\`\`\`${fileExtension}\n${code.trim()}\n\`\`\``;

const replaceAsync = async (
  str: string,
  regex: RegExp,
  asyncFn: (str: string, p1: string) => Promise<string>
) => {
  const promises: Promise<string>[] = [];
  str.replace(regex, (match, p1) => {
    const promise = asyncFn(match, p1);
    promises.push(promise);
    return "";
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift() ?? "");
};

export default replaceCodeDirectives;
