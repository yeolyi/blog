import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

export default function ImageViewer({
  src,
  alt,
  priority,
  widthPercentage,
  href,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  widthPercentage?: string;
  href?: string;
}) {
  const image = (
    <Image
      src={src}
      alt={alt}
      sizes="100vw"
      style={{ width: widthPercentage ?? '33%', height: 'auto' }}
      priority={priority}
      className="shadow-lg"
    />
  );

  return href ? <Link href={href}>{image}</Link> : image;
}
