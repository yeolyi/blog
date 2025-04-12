// utils/mediaType.ts
export function getMediaTypeFromUrl(url: string): 'image' | 'video' {
  const fileExt = url.split('.').pop()?.split('?')[0]?.toLowerCase() || '';
  const videoExtensions = [
    'mp4',
    'webm',
    'ogg',
    'mov',
    'avi',
    'wmv',
    'flv',
    'mkv',
  ];
  return videoExtensions.includes(fileExt) ? 'video' : 'image';
}

export const getMediaTypeFromFile = (file: File): 'image' | 'video' => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';

  // MIME 타입으로 판단 안되면 확장자로 판단
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  const videoExtensions = [
    'mp4',
    'webm',
    'ogg',
    'mov',
    'avi',
    'wmv',
    'flv',
    'mkv',
  ];
  return videoExtensions.includes(fileExt) ? 'video' : 'image';
};
