'use client';

import { Button } from '@/components/ui/button';
import { Loader, Menu } from 'lucide-react';
import { type ReactNode, useTransition } from 'react';

type Props = {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
};

export default function TabButton({ children, isActive, onClick }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      onClick();
    });
  };

  if (isPending) {
    return (
      <Button variant="secondary" disabled>
        <Loader />
        {children}
      </Button>
    );
  }

  return (
    <Button variant={isActive ? 'default' : 'ghost'} onClick={handleClick}>
      <Menu />
      {children}
    </Button>
  );
}
