export const isSingleEmoji = (text: string): boolean => {
  // Intl.Segmenter를 사용하여 그래픽 클러스터로 텍스트 분할
  const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
  const segments = [...segmenter.segment(text.trim())];

  // 정확히 하나의 그래픽 클러스터만 있는지 확인
  if (segments.length !== 1) return false;

  // 이모지 유니코드 범위 확인
  const segment = segments[0].segment;

  // 이모지 감지 정규식
  const emojiRegex = /\p{Emoji}/u;

  // 텍스트가 이모지인지 확인
  return emojiRegex.test(segment);
};

export const saveJSONToFile = (json: string, filename: string) => {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const selectJSONFromFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    };

    input.click();
    input.remove();
  });
};

export const getErrMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return `알 수 없는 에러: ${String(error)}`;
};
