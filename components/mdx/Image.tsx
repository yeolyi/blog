'use client';
import mediumZoom from 'medium-zoom/dist/pure';
import NextImage from 'next/image';

type Props = React.ComponentProps<typeof NextImage> & {
  caption?: string;
};

export default function Image({ className, caption, ...props }: Props) {
  if (caption) {
    return (
      <div className="flex flex-col gap-2 not-prose">
        <ZoomableImage {...props} className={className} />
        <p className="text-sm text-gray-500 mx-auto">{caption}</p>
      </div>
    );
  }
  return <ZoomableImage {...props} className={className} />;
}

const ZoomableImage = ({ className, ...props }: Props) => {
  return (
    <NextImage
      {...props}
      className={className ?? 'object-contain w-full'}
      ref={(ref) => {
        if (!ref) return;
        const zoom = mediumZoom(ref, {
          background: 'rgba(0, 0, 0, 0.7)',
          scrollOffset: 20,
        });
        return () => {
          zoom.detach();
        };
      }}
    />
  );
};
