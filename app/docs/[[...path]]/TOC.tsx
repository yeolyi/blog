"use client";

import { TOC } from "@/lib/getFilledPost";
import Link from "next/link";
import { useReducer } from "react";

export default function TOC({ toc }: { toc: TOC }) {
  const [expanded, toggleExpanded] = useReducer((x) => !x, false);
  return (
    <nav>
      <button className="" onClick={toggleExpanded}>
        목차 {expanded ? "닫기" : "보기"}
      </button>
      {expanded && (
        <ul>
          {toc.h2.map(({ name }) => (
            <li key={name}>
              <Link
                href={`#${name.replace(/ /, "-")}`}
                className="no-underline text-slate-300"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
