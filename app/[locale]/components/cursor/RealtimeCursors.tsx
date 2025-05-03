'use client';

import { useRealtimeCursors } from '@/hooks/useRealTimeCursors';
import { useRef } from 'react';
import { Cursor } from './Cursor';

const THROTTLE_MS = 50;
const ROOM_NAME = 'main-page';

export const RealtimeCursors = () => {
  const username = useRef(crypto.randomUUID());
  const { cursors } = useRealtimeCursors({
    roomName: ROOM_NAME,
    username: username.current,
    throttleMs: THROTTLE_MS,
  });

  return (
    <div>
      {Object.keys(cursors).map((id) => (
        <Cursor
          key={id}
          className="fixed z-50"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${cursors[id].position.x}px, ${cursors[id].position.y}px)`,
          }}
          color={cursors[id].color}
        />
      ))}
    </div>
  );
};
