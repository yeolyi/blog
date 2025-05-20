import { useLayoutEffect, useState } from 'react';

import { isTouchDevice } from '@/utils/isTouchDevice';

export type TouchDeviceState =
  | {
      type: 'loading';
    }
  | {
      type: 'desktop';
    }
  | {
      type: 'mobile';
      value: boolean;
    };

export const useTouchDeviceState = () => {
  const [state, setState] = useState<TouchDeviceState>({ type: 'loading' });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = isTouchDevice();
    setState(isTouch ? { type: 'mobile', value: false } : { type: 'desktop' });
  }, []);

  return [state, setState] as const;
};
