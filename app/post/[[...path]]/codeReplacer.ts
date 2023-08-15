import * as path from "path";
import { BASE_URL } from "./page";

const codeContentRegex = /!@([^@!]+)@!/g;

export const replaceCodeDirectives = async (
  content: string,
  postAbsolutePath: string
) => {
  const replacer = async (match: string, codeFileRelativePath: string) => {
    const codeFullPath = path.join(postAbsolutePath, codeFileRelativePath);
    try {
      const extension = extractFileExtension(codeFileRelativePath);
      const resp = await fetch(BASE_URL + codeFullPath);
      const code = await resp.text();
      return formatMarkdownCode(extension, code);
    } catch {
      throw new Error(`코드 대체 불가: ${codeFullPath}`);
    }
  };
  return replaceAsync(content, codeContentRegex, replacer);
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

const extractFileExtension = (path: string) => {
  const splited = path.split(".");
  const ext = splited[splited.length - 1];
  return ext;
};
