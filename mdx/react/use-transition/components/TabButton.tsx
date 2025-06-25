'use client';

import Button from '@/components/ui/Button';
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
      <Button bg="gray" disabled Icon={Loader}>
        {children}
      </Button>
    );
  }

  return (
    <Button
      bg={isActive ? 'green' : 'transparent'}
      onClick={handleClick}
      Icon={Menu}
    >
      {children}
    </Button>
  );
}
