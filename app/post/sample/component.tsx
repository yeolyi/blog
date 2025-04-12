'use client';

import { useState, useEffect } from 'react';

export default function SampleClockComponent() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div suppressHydrationWarning>{time.toLocaleTimeString()}</div>;
}
