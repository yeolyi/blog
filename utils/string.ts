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
