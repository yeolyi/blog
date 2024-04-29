'use client';

import { useEffect } from 'react';

export type ThreeJSScript = (canvas: HTMLCanvasElement) => void;

export default function ThreeJSHelper({ script }: { script: ThreeJSScript }) {
  useEffect(() => {
    script(document.getElementById('app') as HTMLCanvasElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas id="app" className="aspect-video w-[100%]" />;
}
