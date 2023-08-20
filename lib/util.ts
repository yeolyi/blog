import { lstat } from "fs/promises";

export const isDirectory = async (path: string) => {
  const stat = await lstat(path);
  return stat.isDirectory();
};

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

// https://stackoverflow.com/a/53508547
export const mapAsync = <T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<U>
): Promise<U[]> => {
  return Promise.all(array.map(callbackfn));
};
