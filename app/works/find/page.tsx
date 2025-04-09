"use client";

import { useEffect, useRef } from "react";
import {  styled } from "@pigment-css/react";

export default function FindPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let done = false;

    const updatePosition = () => {
      if (done) return;

      const x = window.screenX;
      const y = window.screenY;      
      container.style.transform = `translate(${-x}px, ${-y}px)`;
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
          <Target ref={containerRef} onClick={console.log}>🐠</Target>
          <IceOverlay />
          <Text>물고기 잡기 🎣</Text>
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

const Target = styled.div`
  position: fixed;
  top: 200px;
  left: 200px;
  transition: transform 0.1s linear;
  font-size: 10rem;
`;

const IceOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh; 
    background: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    mask-image: radial-gradient(circle at 50vw 50vh, transparent 12rem, black 12rem);
    mask-composite: exclude;
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