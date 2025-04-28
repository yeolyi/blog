'use client';

import mediumZoom from 'medium-zoom/dist/pure';
import NextImage from 'next/image';
import 'medium-zoom/dist/style.css';

export default function Image(props: React.ComponentProps<typeof NextImage>) {
  return (
    <NextImage
      {...props}
      className="object-contain w-full"
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
}
