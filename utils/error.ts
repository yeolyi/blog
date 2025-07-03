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

export function wrapServerAction<U>(
	action: () => Promise<U>,
): () => Promise<ServerActionResult<U>>;
export function wrapServerAction<T, U>(
	action: (props: T) => Promise<U>,
): (props: T) => Promise<ServerActionResult<U>>;
export function wrapServerAction<T, U>(
	action: (props?: T) => Promise<U>,
): (props?: T) => Promise<ServerActionResult<U>> {
	return async (props?: T) => {
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
}
