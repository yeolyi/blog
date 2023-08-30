'use client';

import { TOC } from '@/lib/extractTOC';
import Link from 'next/link';
import { useReducer } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

export default function TOC({ toc }: { toc: TOC }) {
  const [expanded, toggleExpanded] = useReducer((x) => !x, false);
  return (
    <nav>
      <button
        className="flex items-center text-white font-bold mb-2"
        onClick={toggleExpanded}
      >
        목차
        {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {expanded && (
        <ul className="leading-8">
          {toc.h2.map(({ name }) => (
            <TOCRow
              key={name}
              name={name}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}

const TOCRow = ({ name }: { name: string }) => (
  <li>
    <Link
      href={`#${name.replace(/ /, '-')}`}
      className="no-underline text-slate-300"
    >
      {name}
    </Link>
  </li>
);
