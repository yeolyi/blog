'use client';

import { useEffect } from 'react';
import './style.css';

export default function Page() {
  useEffect(() => {
    import('./script.js');
  }, []);
  return (
    <>
      <canvas className="webgl" />
      <h1
        id="title"
        className="absolute left-1/2 top-10 -translate-x-1/2 font-mono text-3xl font-bold text-white"
      >
        Quack
      </h1>
      <p className="absolute left-1/2 top-20 -translate-x-1/2 font-mono text-base text-white">
        Click rotating duck
      </p>
      <p
        id="timer"
        className="absolute left-10 top-10 font-mono text-2xl font-bold text-white"
      >
        0.0s
      </p>
      <p
        id="time"
        className="absolute right-10 top-10 font-mono text-2xl font-bold text-white"
      >
        0
      </p>
    </>
  );
}
