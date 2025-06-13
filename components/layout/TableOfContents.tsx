'use client';

import { Link } from '@/i18n/navigation';
import { ScrollArea } from 'radix-ui';
import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const { headings, activeId } = useTableOfContents();

  if (headings.length === 0) return null;

  return (
    <ScrollArea.Root className="w-56 h-[70vh]">
      {/* https://github.com/radix-ui/primitives/issues/2722 */}
      <ScrollArea.Viewport className="w-full h-full [&>div]:!block">
        <nav>
          <ul className="space-y-3">
            {headings.map(({ id, level, text }) => {
              const isActive = activeId === id;
              const paddingLeft = `${level - 2}rem`;

              return (
                <li key={id}>
                  <Link
                    href={`#${id}`}
                    className={`hover:text-white w-full truncate line-clamp-1 ${
                      isActive ? 'text-white font-medium' : 'text-gray-400'
                    }`}
                    style={{ paddingLeft }}
                  >
                    {text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className="select-none touch-none w-2"
      >
        <ScrollArea.Thumb className="bg-white/50 hover:bg-white/70" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

function useTableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll('h2, h3, h4, h5, h6'),
    );

    const items = headingElements.map((heading) => {
      const level = Number.parseInt(heading.tagName.substring(1));
      const id = heading.id || '';
      const text = heading.textContent || '';

      return { id, text, level };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px' },
    );

    for (const element of headingElements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return { headings, activeId };
}
