'use client';

import * as ScrollArea from '@radix-ui/react-scroll-area';
import './scrollable-area.css';

interface ScrollableTableProps {
  children: React.ReactNode;
}

export function ScrollableTable({ children }: ScrollableTableProps) {
  return (
    <ScrollArea.Root className="ScrollAreaRoot" type="hover">
      <ScrollArea.Viewport className="ScrollAreaViewport">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="ScrollAreaScrollbar"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
