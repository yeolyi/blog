'use client';

import { useEffect, useState } from 'react';

export default function FindPage() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [success, setSuccess] = useState(false);

  const inCircle = isInCircle(position.x, position.y);

  useEffect(() => {
    let done = false;

    const updatePosition = () => {
      if (done) return;

      const x = window.screenX;
      const y = window.screenY;
      setPosition({ x, y });

      requestAnimationFrame(updatePosition);
    };

    requestAnimationFrame(updatePosition);

    return () => {
      done = true;
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-[#3F7EB3]" />
      <p
        className={`fixed top-[200px] left-[200px] text-[10rem] transition-transform duration-100 ${inCircle ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        style={{ transform: `translate(${-position.x}px, ${-position.y}px)` }}
        onClick={() => inCircle && setSuccess(true)}
        onKeyDown={(e) => inCircle && e.key === 'Enter' && setSuccess(true)}
        suppressHydrationWarning
      >
        {success ? '' : '🐠'}
      </p>
      <div className="fixed top-0 left-0 w-screen h-screen bg-white/15 backdrop-blur-md [mask-image:radial-gradient(circle_at_50vw_50vh,transparent_10rem,black_10rem)] [mask-composite:exclude] pointer-events-none" />
      <p className="fixed top-[calc(50vh-14rem)] left-[50vw] -translate-x-1/2 -translate-y-1/2 text-2xl text-white font-bold">
        {success ? '성공!' : '물고기 잡기 🎣'}
      </p>
    </>
  );
}

const isInCircle = (x: number, y: number) => {
  if (typeof window === 'undefined') return false;

  const fishPos = { x: 280 - x, y: 280 - y };
  const screenPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const distance = Math.sqrt(
    (fishPos.x - screenPos.x) ** 2 + (fishPos.y - screenPos.y) ** 2,
  );
  return distance < 160;
};
