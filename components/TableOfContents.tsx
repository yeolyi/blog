'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const { headings, activeId } = useTableOfContents();
  const t = useTranslations('TableOfContents');

  if (headings.length === 0) return null;

  return (
    <nav className="overflow-auto w-56 break-keep">
      <h2 className="font-bold mb-4 text-white">{t('title')}</h2>
      <ul className="space-y-3">
        {headings.map(({ id, level, text }) => {
          const isActive = activeId === id;
          const paddingLeft = `${(level - 2) * 0.5}rem`;

          return (
            <li key={id}>
              <Link
                href={`#${id}`}
                className={`block hover:text-white transition-colors ${
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
