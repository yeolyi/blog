'use client';

import { useEffect } from 'react';
import { run } from './script';

export default function Page() {
  useEffect(run);

  return <canvas />;
}
