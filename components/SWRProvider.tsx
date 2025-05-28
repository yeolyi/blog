'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { SWRConfig } from 'swr';

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.addEventListener('unhandledrejection', (event) => {
      toast.error(event.reason.message);
    });

    return () => {
      window.removeEventListener('unhandledrejection', (event) => {
        toast.error(event.reason.message);
      });
    };
  }, []);
  return (
    <SWRConfig
      value={{
        onError: (error) => {
          toast.error(error.message);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
