"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

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
      <Background />
      <Fish
        $x={position.x}
        $y={position.y}
        $inCircle={inCircle}
        onClick={() => inCircle && setSuccess(true)}
        suppressHydrationWarning
      >
        {success ? "" : "🐠"}
      </Fish>
      <IceOverlay />
      <Text>{success ? "성공!" : "물고기 잡기 🎣"}</Text>
    </>
  );
}

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #3F7EB3;
`;

const isInCircle = (x: number, y: number) => {
  if (typeof window === 'undefined') return false;

  const fishPos = { x: 280-x, y: 280-y };
  const screenPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const distance = Math.sqrt((fishPos.x - screenPos.x) ** 2 + (fishPos.y - screenPos.y) ** 2);
  return distance < 160;
}

const Fish = styled.p<{ $x: number, $y: number, $inCircle: boolean }>`
  position: fixed;
  top: 200px;
  left: 200px;
  transition: transform 0.1s linear;
  font-size: 10rem;
  transform: translate(${({ $x, $y }) => `${-$x}px, ${-$y}px`});
  cursor: ${({ $inCircle }) => $inCircle ? 'pointer' : 'not-allowed'};
`;

const IceOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; 
    background: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    mask-image: radial-gradient(circle at 50vw 50vh, transparent 10rem, black 10rem);
    mask-composite: exclude;
    pointer-events: none;
`;

const Text = styled.p`
  position: fixed;
  top: calc(50vh - 14rem);
  left: 50vw;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
  font-weight: bold;
`;