import Image from 'next/image';

export default function ImageViewer({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div
      className="relative mx-auto h-[200px] shadow-md"
      style={{ aspectRatio: width / height }}
    >
      <Image src={src} fill alt={alt} className="m-0" />
    </div>
  );
}
