'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type * as React from 'react';
import { useEffect } from 'react';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MetaHandler />
      {children}
    </NextThemesProvider>
  );
}

// https://github.com/pacocoursey/next-themes/issues/78#issuecomment-2927060208
function useMetaTheme() {
  useEffect(() => {
    const updateThemeColor = () => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      const metaThemeColor = document.querySelector('meta[name=theme-color]');
      console.log(metaThemeColor);
      metaThemeColor?.setAttribute('content', bgColor);
    };

    const observer = new MutationObserver(updateThemeColor);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false,
    });

    updateThemeColor();

    return () => observer.disconnect();
  }, []);
}

const MetaHandler = () => {
  useMetaTheme();
  return null;
};
