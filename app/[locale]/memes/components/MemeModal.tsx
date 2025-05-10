'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface MemeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

export default function MemeModal({
  isOpen,
  onOpenChange,
  title,
  children,
}: MemeModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] w-[90vw] max-w-[800px] rounded-md bg-[#1e1e1e] border border-[#5e5e5e] p-6 shadow-xl z-50 overflow-y-auto">
          {title && (
            <Dialog.Title className="text-2xl font-bold text-white mb-6">
              {title}
            </Dialog.Title>
          )}

          {children}

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-[#aaa] hover:text-white"
              aria-label="닫기"
            >
              <X size={24} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 모달 트리거 버튼 컴포넌트
interface ModalTriggerProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function ModalTrigger({
  onClick,
  children,
  className = '',
}: ModalTriggerProps) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
