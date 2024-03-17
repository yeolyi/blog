export const getErrorMessage = (e: unknown) => (e instanceof Error ? e.message : '알 수 없는 에러');
