import Image, { StaticImageData } from 'next/image';

export default function ImageViewer({
  src,
  alt,
  priority,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes="100vw"
      style={{ width: '33%', height: 'auto' }}
      priority={priority}
      className="shadow-lg"
    />
  );
}
