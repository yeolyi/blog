'use client';

import { useEffect } from 'react';
import './style.css';

export default function Page() {
  useEffect(() => {
    import('./script.js');
  }, []);
  return <canvas className="webgl" />;
}
