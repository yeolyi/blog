import { Link } from 'wouter';

export default function ImageViewer({
  src,
  alt,
  widthPercentage,
  href,
}: {
  src: string;
  alt: string;
  widthPercentage?: string;
  href?: string;
}) {
  const image = (
    <img
      src={src}
      alt={alt}
      style={{ width: widthPercentage ?? '33%', height: 'auto' }}
      className="shadow-lg"
    />
  );

  return href ? <Link href={href}>{image}</Link> : image;
}
