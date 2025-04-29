import { useState } from 'react';

import { isTouchDevice } from '@/utils/isTouchDevice';
import { useEffect } from 'react';

export const useTouchDeviceState = () => {
  const [state, setState] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = isTouchDevice();
    if (isTouch) {
      setState(false);
    }
  }, []);

  return [state, setState] as const;
};
