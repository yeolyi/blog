import { getErrMessage } from '@/utils/string';

type ServerActionResult<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      value: string;
    };

export const wrapServerAction =
  async <T, U>(action: (props: T) => Promise<U>) =>
  async (props: T): Promise<ServerActionResult<U>> => {
    try {
      const value = await action(props);
      return {
        success: true,
        value,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        value: getErrMessage(error),
      };
    }
  };

export const unwrapServerAction =
  async <T, U>(action: (props: T) => Promise<ServerActionResult<U>>) =>
  async (props: T) => {
    const { success, value } = await action(props);
    if (!success) throw new Error(value);
    return value;
  };
