'use client';

import { TOC } from '@/lib/extractTOC';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import Link from 'next/link';
import { useReducer } from 'react';

export default function TOC({ toc }: { toc: TOC }) {
  const [expanded, toggleExpanded] = useReducer((x) => !x, false);
  return (
    <nav>
      <button
        className="flex items-center"
        onClick={toggleExpanded}
      >
        목차
        {expanded ? (
          <ChevronUpIcon
            verticalAlign="middle"
            size={24}
          />
        ) : (
          <ChevronDownIcon
            verticalAlign="middle"
            size={24}
          />
        )}
      </button>
      {expanded && (
        <ul>
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
