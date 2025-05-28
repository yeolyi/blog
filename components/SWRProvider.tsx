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
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      toast.error(event.reason.message);
    };

    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      toast.error(event.message);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection,
      );
      window.removeEventListener('error', handleError);
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
