import mediumZoom from '@/client/components/image/medium-zoom';
import { useEffect } from 'react';

export default function MediumZoom() {
  useEffect(() => {
    const imgList = [
      ...document.querySelectorAll('article img'),
    ] as HTMLImageElement[];
    return mediumZoom(imgList);
  }, []);

  return null;
}
