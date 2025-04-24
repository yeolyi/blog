import { createClient } from '@/utils/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { throttle } from 'es-toolkit';
import { PerfectCursor } from 'perfect-cursors';
import { useCallback, useEffect, useRef, useState } from 'react';

const supabase = createClient();

const generateRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`;

const generateRandomNumber = () => Math.floor(Math.random() * 100);

const EVENT_NAME = 'realtime-cursor-move';

type CursorEventPayload = {
  position: {
    x: number;
    y: number;
  };
  user: {
    id: number;
    name: string;
  };
  color: string;
  timestamp: number;
};

export const useRealtimeCursors = ({
  roomName,
  username,
  throttleMs,
}: {
  roomName: string;
  username?: string;
  throttleMs: number;
}) => {
  const [color] = useState(generateRandomColor());
  const [userId] = useState(generateRandomNumber());
  const [cursors, setCursors] = useState<Record<string, CursorEventPayload>>(
    {},
  );

  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const { clientX, clientY } = event;

      const payload: CursorEventPayload = {
        position: {
          x: clientX,
          y: clientY,
        },
        user: {
          id: userId,
          name: userId.toString(),
        },
        color: color,
        timestamp: new Date().getTime(),
      };

      channelRef.current?.send({
        type: 'broadcast',
        event: EVENT_NAME,
        payload: payload,
      });
    },
    [color, userId],
  );

  useEffect(() => {
    const channel = supabase.channel(roomName);
    channelRef.current = channel;

    const pcMap = new Map<number, PerfectCursor>();

    channel
      .on(
        'broadcast',
        { event: EVENT_NAME },
        (data: { payload: CursorEventPayload }) => {
          const { user } = data.payload;
          if (user.id === userId) return;

          setCursors((prev) => {
            return {
              ...prev,
              [user.id]: data.payload,
            };
          });

          let pc: PerfectCursor;
          if (pcMap.has(user.id)) {
            // biome-ignore lint/style/noNonNullAssertion: 바로 위에 has로 체크함
            pc = pcMap.get(user.id)!;
          } else {
            pc = new PerfectCursor((point: number[]) => {
              setCursors((prev) => {
                return {
                  ...prev,
                  [user.id]: { ...prev[user.id], position: point },
                };
              });
            });
            pcMap.set(user.id, pc);
          }

          pc.addPoint([data.payload.position.x, data.payload.position.y]);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      for (const pc of pcMap.values()) {
        pc.dispose();
      }
    };
  }, [roomName, userId]);

  useEffect(() => {
    const throttled = throttle(handleMouseMove, throttleMs);
    window.addEventListener('mousemove', throttled);

    return () => {
      window.removeEventListener('mousemove', throttled);
    };
  }, [handleMouseMove, throttleMs]);

  return { cursors };
};
