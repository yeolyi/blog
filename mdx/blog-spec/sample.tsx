'use client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const SampleClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div suppressHydrationWarning>{dayjs(time).format('HH:mm:ss')}</div>;
};
