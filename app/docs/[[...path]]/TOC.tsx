"use client";

import { TOC } from "@/app/lib/extractTOC";
import Link from "next/link";
import { useReducer } from "react";

export default function TOC({ toc }: { toc: TOC }) {
  const [expanded, toggleExpanded] = useReducer((x) => !x, false);
  return (
    <nav>
      <button className="underline" onClick={toggleExpanded}>
        목차 {expanded ? "닫기" : "보기"}
      </button>
      {expanded && (
        <ul>
          {toc.h2.map(({ name }) => (
            <TOCRow key={name} name={name} />
          ))}
        </ul>
      )}
    </nav>
  );
}

const TOCRow = ({ name }: { name: string }) => (
  <li>
    <Link
      href={`#${name.replace(/ /, "-")}`}
      className="no-underline text-slate-300"
    >
      {name}
    </Link>
  </li>
);
